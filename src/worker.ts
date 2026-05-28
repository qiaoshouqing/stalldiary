import { Client } from "pg";

import { analyzeStallInput } from "../lib/tagging";
import type { ActivityDay, ActivityResponse, StallAccent, StallEntry, StallProduct } from "../lib/types";

type StallEntryRow = {
  id: string;
  product_id: string | null;
  product_name: string | null;
  source_text: string;
  source_url: string | null;
  title: string;
  description: string;
  product_tags: string[];
  channel_tags: string[];
  mood_tags: string[];
  stall_type: string;
  accent: StallEntry["accent"];
  created_at: Date | string;
  updated_at: Date | string;
};

type StallProductRow = {
  id: string;
  name: string;
  description: string;
  accent: StallAccent;
  stall_count?: string | number;
  created_at: Date | string;
  updated_at: Date | string;
};

export type Env = {
  ASSETS: Fetcher;
  HYPERDRIVE?: {
    connectionString: string;
  };
  DATABASE_URL?: string;
  AGENT_WRITE_TOKEN?: string;
  GITHUB_LOGIN?: string;
  GITHUB_TOKEN?: string;
};

const selectFields = `
  id,
  product_id,
  product_name,
  source_text,
  source_url,
  title,
  description,
  product_tags,
  channel_tags,
  mood_tags,
  stall_type,
  accent,
  created_at,
  updated_at
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "stalllog.pomodiary.com") {
      url.hostname = "stalldiary.pomodiary.com";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/api/products") {
      if (request.method === "GET") {
        return handleProductsList(env);
      }

      if (request.method === "POST") {
        return handleProductCreate(request, env);
      }

      return json({ message: "Method not allowed." }, 405);
    }

    if (url.pathname === "/api/agent/stalls" || url.pathname === "/api/scale/stalls") {
      if (request.method === "POST") {
        return handleAgentCreate(request, env);
      }

      return json({ message: "Method not allowed." }, 405);
    }

    if (url.pathname === "/api/stalls") {
      if (request.method === "GET") {
        return handleList(env);
      }

      if (request.method === "POST") {
        return handleCreate(request, env);
      }

      return json({ message: "Method not allowed." }, 405);
    }

    if (url.pathname === "/api/activity") {
      if (request.method === "GET") {
        return handleActivity(env);
      }

      return json({ message: "Method not allowed." }, 405);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleList(env: Env) {
  try {
    const entries = await withClient(env, async (client) => {
      const result = await client.query<StallEntryRow>(
        `SELECT ${selectFields}
         FROM stall_entries
         ORDER BY created_at DESC
         LIMIT $1`,
        [64]
      );

      return result.rows.map(rowToEntry);
    });

    return json({ entries });
  } catch (error) {
    console.error(error);
    return json({ message: "Unable to load stall entries." }, 500);
  }
}

async function handleCreate(request: Request, env: Env) {
  try {
    const body = (await request.json().catch(() => null)) as {
      productId?: unknown;
      rawInput?: unknown;
    } | null;
    const rawInput = typeof body?.rawInput === "string" ? body.rawInput.trim() : "";
    const productId = typeof body?.productId === "string" ? body.productId.trim() : "";

    if (!rawInput) {
      return json({ message: "Stall input is required." }, 400);
    }

    const entry = await createStallEntry(env, rawInput, { productId });

    return json({ entry }, 201);
  } catch (error) {
    console.error(error);
    return error instanceof RequestError
      ? json({ message: error.message }, error.status)
      : json({ message: "Unable to create stall entry." }, 500);
  }
}

async function handleProductsList(env: Env) {
  try {
    const products = await withClient(env, async (client) => {
      const result = await client.query<StallProductRow>(
        `SELECT
           p.id,
           p.name,
           p.description,
           p.accent,
           count(e.id) AS stall_count,
           p.created_at,
           p.updated_at
         FROM stall_products p
         LEFT JOIN stall_entries e ON e.product_id = p.id
         GROUP BY p.id
         ORDER BY p.created_at ASC`
      );

      return result.rows.map(rowToProduct);
    });

    return json({ products });
  } catch (error) {
    console.error(error);
    return json({ message: "Unable to load products." }, 500);
  }
}

async function handleProductCreate(request: Request, env: Env) {
  try {
    const body = (await request.json().catch(() => null)) as ProductCreateBody | null;
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const description = typeof body?.description === "string" ? body.description.trim() : "";
    const accent = parseAccent(body?.accent) ?? getDefaultProductAccent(name);

    if (!name) {
      return json({ message: "Product name is required." }, 400);
    }

    if (name.length > 40) {
      return json({ message: "Product name is too long." }, 400);
    }

    if (body?.dryRun === true) {
      return json({
        ok: true,
        dryRun: true,
        preview: {
          name,
          description,
          accent
        }
      });
    }

    const { product, created } = await withClient(env, (client) =>
      ensureProductByName(client, name, description, accent)
    );

    return json({ product, created }, created ? 201 : 200);
  } catch (error) {
    console.error(error);
    return json({ message: "Unable to create product." }, 500);
  }
}

type ProductCreateBody = {
  name?: unknown;
  description?: unknown;
  accent?: unknown;
  dryRun?: unknown;
};

async function handleAgentCreate(request: Request, env: Env) {
  const authResult = authorizeAgentRequest(request, env);

  if (authResult) {
    return authResult;
  }

  try {
    const body = (await request.json().catch(() => null)) as AgentCreateBody | null;
    const rawInput = getAgentRawInput(body);
    const productId = typeof body?.productId === "string" ? body.productId.trim() : "";
    const productName = typeof body?.productName === "string" ? body.productName.trim() : "";

    if (!rawInput) {
      return json({ message: "Stall input is required." }, 400);
    }

    if (body?.dryRun === true) {
      return json({
        ok: true,
        dryRun: true,
        preview: analyzeStallInput(rawInput)
      });
    }

    const entry = await createStallEntry(env, rawInput, { productId, productName });

    return json({
      ok: true,
      entry
    }, 201);
  } catch (error) {
    console.error(error);
    return error instanceof RequestError
      ? json({ message: error.message }, error.status)
      : json({ message: "Unable to create stall entry." }, 500);
  }
}

type AgentCreateBody = {
  productId?: unknown;
  productName?: unknown;
  rawInput?: unknown;
  text?: unknown;
  content?: unknown;
  note?: unknown;
  url?: unknown;
  dryRun?: unknown;
};

function getAgentRawInput(body: AgentCreateBody | null) {
  if (typeof body?.rawInput === "string" && body.rawInput.trim()) {
    return body.rawInput.trim();
  }

  return [body?.text, body?.content, body?.note, body?.url]
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .map((value) => value.trim())
    .join("\n")
    .trim();
}

function authorizeAgentRequest(request: Request, env: Env) {
  const expectedToken = env.AGENT_WRITE_TOKEN?.trim();

  if (!expectedToken) {
    return json({ message: "Agent write token is not configured." }, 503);
  }

  const authorization = request.headers.get("Authorization") ?? "";
  const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const headerToken =
    request.headers.get("X-StallDiary-Token")?.trim() ??
    request.headers.get("X-StallLog-Token")?.trim();
  const receivedToken = bearerToken ?? headerToken ?? "";

  if (!safeTokenEqual(receivedToken, expectedToken)) {
    return json({ message: "Unauthorized." }, 401);
  }

  return null;
}

function safeTokenEqual(receivedToken: string, expectedToken: string) {
  if (!receivedToken || receivedToken.length !== expectedToken.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < expectedToken.length; index += 1) {
    difference |= receivedToken.charCodeAt(index) ^ expectedToken.charCodeAt(index);
  }

  return difference === 0;
}

async function createStallEntry(
  env: Env,
  rawInput: string,
  options: { productId?: string; productName?: string } = {}
) {
  const analysis = analyzeStallInput(rawInput);

  return withClient(env, async (client) => {
    const product = await resolveProductForEntry(client, options);
    const productTags = product
      ? uniqueStrings([
          product.name,
          ...analysis.productTags.filter((tag) => tag !== product.name)
        ])
      : analysis.productTags;

    const result = await client.query<StallEntryRow>(
      `INSERT INTO stall_entries (
         id,
         product_id,
         product_name,
         source_text,
         source_url,
         title,
         description,
         product_tags,
         channel_tags,
         mood_tags,
         stall_type,
         accent
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING ${selectFields}`,
      [
        crypto.randomUUID(),
        product?.id ?? null,
        product?.name ?? null,
        rawInput,
        analysis.sourceUrl,
        analysis.title,
        analysis.description,
        productTags,
        analysis.channelTags,
        analysis.moodTags,
        product ? "product" : analysis.stallType,
        product?.accent ?? analysis.accent
      ]
    );

    return rowToEntry(result.rows[0]);
  });
}

async function resolveProductForEntry(
  client: Client,
  options: { productId?: string; productName?: string }
) {
  if (options.productId) {
    const result = await client.query<StallProductRow>(
      `SELECT id, name, description, accent, created_at, updated_at
       FROM stall_products
       WHERE id = $1
       LIMIT 1`,
      [options.productId]
    );

    if (!result.rows[0]) {
      throw new RequestError("Selected product does not exist.", 400);
    }

    return rowToProduct(result.rows[0]);
  }

  if (options.productName) {
    const { product } = await ensureProductByName(client, options.productName, "", undefined);
    return product;
  }

  return null;
}

async function ensureProductByName(
  client: Client,
  name: string,
  description = "",
  accent?: StallAccent
) {
  const existing = await client.query<StallProductRow>(
    `SELECT id, name, description, accent, created_at, updated_at
     FROM stall_products
     WHERE lower(name) = lower($1)
     LIMIT 1`,
    [name]
  );

  if (existing.rows[0]) {
    return {
      product: rowToProduct(existing.rows[0]),
      created: false
    };
  }

  const result = await client.query<StallProductRow>(
    `INSERT INTO stall_products (
       id,
       name,
       description,
       accent
     )
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, accent, created_at, updated_at`,
    [
      crypto.randomUUID(),
      name,
      description,
      accent ?? getDefaultProductAccent(name)
    ]
  );

  return {
    product: rowToProduct(result.rows[0]),
    created: true
  };
}

async function handleActivity(env: Env) {
  const { from, to } = getActivityRange();

  try {
    const promoCounts = await getPromotionCounts(env, from);
    const { codeCounts, source } = await getCodeContributionCounts(env, from, to);
    const days = buildActivityDays(from, to, promoCounts, codeCounts);

    return json<ActivityResponse>({
      days,
      summary: summarizeActivity(days, source, from, to)
    });
  } catch (error) {
    console.error(error);
    return json({ message: "Unable to load activity." }, 500);
  }
}

async function getPromotionCounts(env: Env, from: string) {
  return withClient(env, async (client) => {
    const result = await client.query<{ date: string; count: string | number }>(
      `SELECT to_char((created_at AT TIME ZONE 'Asia/Shanghai')::date, 'YYYY-MM-DD') AS date,
              count(*) AS count
       FROM stall_entries
       WHERE created_at >= $1::timestamptz
       GROUP BY 1
       ORDER BY 1`,
      [`${from}T00:00:00+08:00`]
    );

    return new Map(
      result.rows.map((row) => [row.date, Number(row.count)])
    );
  });
}

async function getCodeContributionCounts(env: Env, from: string, to: string) {
  const token = env.GITHUB_TOKEN;

  if (!token) {
    return {
      codeCounts: new Map<string, number>(),
      source: "missing-token" as const
    };
  }

  try {
    const login = env.GITHUB_LOGIN?.trim();

    if (!login) {
      return {
        codeCounts: new Map<string, number>(),
        source: "missing-token" as const
      };
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "stalldiary-worker"
      },
      body: JSON.stringify({
        query: `
          query Activity($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          login,
          from: `${from}T00:00:00Z`,
          to: `${to}T23:59:59Z`
        }
      })
    });

    const payload = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              weeks?: Array<{
                contributionDays: Array<{
                  date: string;
                  contributionCount: number;
                }>;
              }>;
            };
          };
        };
      };
      errors?: unknown;
    };

    if (!response.ok || payload.errors || !payload.data?.user) {
      console.error(payload.errors ?? `${response.status} ${response.statusText}`);
      return {
        codeCounts: new Map<string, number>(),
        source: "error" as const
      };
    }

    const contributionDays =
      payload.data.user.contributionsCollection?.contributionCalendar?.weeks?.flatMap(
        (week) => week.contributionDays
      ) ?? [];

    return {
      codeCounts: new Map(
        contributionDays.map((day) => [day.date, day.contributionCount])
      ),
      source: "github" as const
    };
  } catch (error) {
    console.error(error);
    return {
      codeCounts: new Map<string, number>(),
      source: "error" as const
    };
  }
}

function getActivityRange() {
  const to = toShanghaiDateKey(new Date());
  const fromDate = new Date(`${to}T00:00:00Z`);
  fromDate.setUTCDate(fromDate.getUTCDate() - 364);

  return {
    from: toUtcDateKey(fromDate),
    to
  };
}

function buildActivityDays(
  from: string,
  to: string,
  promoCounts: Map<string, number>,
  codeCounts: Map<string, number>
): ActivityDay[] {
  const days: ActivityDay[] = [];
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);

  while (cursor <= end) {
    const date = toUtcDateKey(cursor);
    days.push({
      date,
      promoCount: promoCounts.get(date) ?? 0,
      codeCount: codeCounts.get(date) ?? 0
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function summarizeActivity(
  days: ActivityDay[],
  codeSource: ActivityResponse["summary"]["codeSource"],
  from: string,
  to: string
): ActivityResponse["summary"] {
  const promoCounts = days.map((day) => day.promoCount);
  const codeCounts = days.map((day) => day.codeCount);

  return {
    from,
    to,
    promoTotal: sum(promoCounts),
    codeTotal: sum(codeCounts),
    promoActiveDays: days.filter((day) => day.promoCount > 0).length,
    codeActiveDays: days.filter((day) => day.codeCount > 0).length,
    overlapDays: days.filter((day) => day.promoCount > 0 && day.codeCount > 0).length,
    maxPromoCount: Math.max(0, ...promoCounts),
    maxCodeCount: Math.max(0, ...codeCounts),
    codeSource
  };
}

async function withClient<T>(env: Env, callback: (client: Client) => Promise<T>) {
  const connectionString = getConnectionString(env);
  const client = new Client({ connectionString });

  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

function getConnectionString(env: Env) {
  const connectionString = env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Database connection is not configured.");
  }

  return connectionString;
}

function rowToEntry(row: StallEntryRow): StallEntry {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    sourceText: row.source_text,
    sourceUrl: row.source_url,
    title: row.title,
    description: row.description,
    productTags: row.product_tags,
    channelTags: row.channel_tags,
    moodTags: row.mood_tags,
    stallType: row.stall_type,
    accent: row.accent,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

function rowToProduct(row: StallProductRow): StallProduct {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    accent: row.accent,
    stallCount: Number(row.stall_count ?? 0),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

function parseAccent(value: unknown): StallAccent | undefined {
  return typeof value === "string" && isAccent(value) ? value : undefined;
}

function isAccent(value: string): value is StallAccent {
  return ["coral", "teal", "green", "gold", "ink"].includes(value);
}

function getDefaultProductAccent(name: string): StallAccent {
  const accents: StallAccent[] = ["coral", "teal", "green", "gold", "ink"];
  const index = Array.from(name).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  ) % accents.length;

  return accents[index];
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

class RequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toUtcDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toShanghaiDateKey(value: Date) {
  return new Date(value.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function json<TPayload>(payload: TPayload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
