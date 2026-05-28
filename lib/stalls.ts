import { randomUUID } from "node:crypto";

import { getPool } from "./db";
import { analyzeStallInput } from "./tagging";
import type { StallEntry } from "./types";

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

export async function listStallEntries(limit = 32): Promise<StallEntry[]> {
  const result = await getPool().query<StallEntryRow>(
    `SELECT ${selectFields}
     FROM stall_entries
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map(rowToEntry);
}

export async function createStallEntry(rawInput: string): Promise<StallEntry> {
  const analysis = analyzeStallInput(rawInput);
  const result = await getPool().query<StallEntryRow>(
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
      randomUUID(),
      null,
      null,
      rawInput.trim(),
      analysis.sourceUrl,
      analysis.title,
      analysis.description,
      analysis.productTags,
      analysis.channelTags,
      analysis.moodTags,
      analysis.stallType,
      analysis.accent
    ]
  );

  return rowToEntry(result.rows[0]);
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

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
