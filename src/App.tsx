import {
  CalendarDays,
  Code2,
  ExternalLink,
  Globe2,
  Loader2,
  Megaphone,
  Plus,
  RadioTower,
  Send,
  Sparkles,
  Store,
  Tag,
  Video
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  formatMessage,
  getInitialLocale,
  localeLabels,
  persistLocale,
  toIntlLocale,
  translations,
  type Locale,
  type Translation
} from "./i18n";
import type { ActivityDay, ActivityResponse, StallEntry, StallProduct } from "../lib/types";

type LoadState = "loading" | "ready" | "error";
type EntryFilterOption = {
  value: string;
  label: string;
  count: number;
  accent?: StallProduct["accent"];
};

const ALL_ENTRIES_FILTER = "all";
const UNASSIGNED_ENTRIES_FILTER = "unassigned";

export default function App() {
  const [entries, setEntries] = useState<StallEntry[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [rawInput, setRawInput] = useState("");
  const [products, setProducts] = useState<StallProduct[]>([]);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [entryProductFilter, setEntryProductFilter] = useState(ALL_ENTRIES_FILTER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [activityState, setActivityState] = useState<LoadState>("loading");
  const t = translations[locale];

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  useEffect(() => {
    let alive = true;

    const loadStalls = fetch("/api/stalls")
      .then(async (response) => {
        const payload = (await response.json()) as { entries?: StallEntry[] };

        if (!response.ok || !payload.entries) {
          throw new Error(t.errors.loadStalls);
        }

        if (alive) {
          setEntries(payload.entries);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (alive) {
          setLoadState("error");
        }
      });

    const loadActivity = fetchActivity(t).then((payload) => {
      if (alive) {
        setActivity(payload);
        setActivityState("ready");
      }
    }).catch(() => {
      if (alive) {
        setActivityState("error");
      }
    });

    const loadProducts = fetchProducts(t).then((payload) => {
      if (alive) {
        setProducts(payload);
      }
    });

    void Promise.allSettled([loadStalls, loadActivity, loadProducts]);

    return () => {
      alive = false;
    };
  }, [t.errors.loadStalls]);

  const stats = useMemo(() => {
    const productCount =
      products.length || new Set(entries.flatMap((entry) => entry.productTags)).size;
    const platforms = new Set(entries.flatMap((entry) => entry.channelTags)).size;
    const latest = entries[0]?.createdAt
      ? formatDay(entries[0].createdAt, locale)
      : t.stats.neverOpened;

    return {
      total: entries.length,
      products: productCount,
      platforms,
      latest
    };
  }, [entries, locale, products, t.stats.neverOpened]);

  const entryFilterOptions = useMemo(
    () => buildEntryFilterOptions(entries, products, t),
    [entries, products, t]
  );
  const filteredEntries = useMemo(
    () =>
      entryProductFilter === ALL_ENTRIES_FILTER
        ? entries
        : entries.filter(
            (entry) => getEntryFilterValue(entry, products) === entryProductFilter
          ),
    [entries, entryProductFilter, products]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = rawInput.trim();

    if (!trimmedInput) {
      setError(t.errors.requiredInput);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/stalls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rawInput: trimmedInput,
          productId: selectedProductId || undefined
        })
      });
      const payload = (await response.json()) as {
        entry?: StallEntry;
        message?: string;
      };

      if (!response.ok || !payload.entry) {
        throw new Error(payload.message ?? t.errors.saveFailed);
      }

      setEntries((current) => [payload.entry as StallEntry, ...current]);
      setRawInput("");
      if (
        entryProductFilter !== ALL_ENTRIES_FILTER &&
        getEntryFilterValue(payload.entry as StallEntry, products) !== entryProductFilter
      ) {
        setEntryProductFilter(ALL_ENTRIES_FILTER);
      }
      refreshActivity(setActivity, setActivityState, t);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t.errors.saveFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateProduct() {
    const name = newProductName.trim();

    if (!name) {
      setProductError(t.errors.productNameRequired);
      return;
    }

    setIsCreatingProduct(true);
    setProductError(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });
      const payload = (await response.json()) as {
        product?: StallProduct;
        message?: string;
      };

      if (!response.ok || !payload.product) {
        throw new Error(payload.message ?? t.errors.productCreateFailed);
      }

      setProducts((current) => upsertProduct(current, payload.product as StallProduct));
      setSelectedProductId(payload.product.id);
      setNewProductName("");
    } catch (caughtError) {
      setProductError(
        caughtError instanceof Error ? caughtError.message : t.errors.productCreateFailed
      );
    } finally {
      setIsCreatingProduct(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-content">
          <div className="hero-topline">
            <p className="eyebrow">
              <Megaphone aria-hidden="true" size={17} />
              {t.hero.eyebrow}
            </p>
            <LanguageSwitcher locale={locale} onLocaleChange={setLocale} t={t} />
          </div>
          <h1 id="page-title">StallDiary</h1>
          <p className="hero-lede">{t.hero.lede}</p>

          <div className="hero-actions" aria-label={t.hero.actionsAria}>
            <span>
              <RadioTower aria-hidden="true" size={16} />
              {t.hero.platforms}
            </span>
            <span>
              <Video aria-hidden="true" size={16} />
              {t.hero.media}
            </span>
            <span>
              <Sparkles aria-hidden="true" size={16} />
              {t.hero.autoArchive}
            </span>
          </div>

          <div className="stats-panel" aria-label={t.hero.statsAria}>
            <StatItem label={t.stats.records} value={`${stats.total}`} />
            <StatItem label={t.stats.products} value={`${stats.products}`} />
            <StatItem label={t.stats.platforms} value={`${stats.platforms}`} />
            <StatItem label={t.stats.latest} value={stats.latest} />
          </div>

          <form className="composer hero-composer" onSubmit={handleSubmit} aria-label={t.composer.aria}>
            <div className="section-heading composer-heading">
              <div>
                <p className="section-kicker">{t.composer.kicker}</p>
                <h2>{t.composer.title}</h2>
              </div>
              <span className="auto-badge">
                <Sparkles aria-hidden="true" size={15} />
                {t.composer.autoBadge}
              </span>
            </div>

            <ProductPicker
              isCreating={isCreatingProduct}
              newProductName={newProductName}
              onCreateProduct={handleCreateProduct}
              onNewProductNameChange={setNewProductName}
              onSelectProduct={setSelectedProductId}
              productError={productError}
              products={products}
              selectedProductId={selectedProductId}
              t={t}
            />

            <label className="sr-only" htmlFor="stall-input">
              {t.composer.inputLabel}
            </label>
            <textarea
              id="stall-input"
              value={rawInput}
              onChange={(event) => setRawInput(event.target.value)}
              placeholder={t.composer.placeholder}
              rows={3}
            />

            <div className="composer-actions">
              <p>{t.composer.helper}</p>
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <Loader2 className="spin" aria-hidden="true" size={18} />
                ) : (
                  <Send aria-hidden="true" size={18} />
                )}
                {t.composer.submit}
              </button>
            </div>

            {error ? <p className="form-error">{error}</p> : null}
            {loadState === "error" ? (
              <p className="form-error">{t.composer.dbError}</p>
            ) : null}
          </form>
        </div>
      </section>

      <ActivityPanel activity={activity} loadState={activityState} locale={locale} t={t} />

      <section className="entries-section" aria-label={t.entries.aria}>
        <div className="section-heading">
          <div>
            <p className="section-kicker">{t.entries.kicker}</p>
            <h2>{t.entries.title}</h2>
          </div>
          <div className="street-lamps" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        {entryFilterOptions.length > 1 ? (
          <EntryFilterBar
            onSelectFilter={setEntryProductFilter}
            options={entryFilterOptions}
            selectedFilter={entryProductFilter}
            t={t}
          />
        ) : null}

        {loadState === "loading" ? (
          <div className="empty-stall">
            <Loader2 className="spin" aria-hidden="true" size={28} />
            <h3>{t.entries.loadingTitle}</h3>
            <p>{t.entries.loadingBody}</p>
          </div>
        ) : filteredEntries.length ? (
          <div className="stall-grid">
            {filteredEntries.map((entry) => (
              <StallCard entry={entry} key={entry.id} locale={locale} t={t} />
            ))}
          </div>
        ) : entries.length ? (
          <div className="empty-stall">
            <Store aria-hidden="true" size={28} />
            <h3>{t.entries.filterEmptyTitle}</h3>
            <p>{t.entries.filterEmptyBody}</p>
          </div>
        ) : (
          <div className="empty-stall">
            <Plus aria-hidden="true" size={28} />
            <h3>{t.entries.emptyTitle}</h3>
            <p>{t.entries.emptyBody}</p>
          </div>
        )}
      </section>
    </main>
  );
}

function LanguageSwitcher({
  locale,
  onLocaleChange,
  t
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  t: Translation;
}) {
  return (
    <label className="language-switcher">
      <span>
        <Globe2 aria-hidden="true" size={15} />
        {t.language.label}
      </span>
      <select
        aria-label={t.language.aria}
        onChange={(event) => onLocaleChange(event.target.value as Locale)}
        value={locale}
      >
        {(Object.keys(localeLabels) as Locale[]).map((localeKey) => (
          <option key={localeKey} value={localeKey}>
            {localeLabels[localeKey]}
          </option>
        ))}
      </select>
    </label>
  );
}

function EntryFilterBar({
  onSelectFilter,
  options,
  selectedFilter,
  t
}: {
  onSelectFilter: (filterValue: string) => void;
  options: EntryFilterOption[];
  selectedFilter: string;
  t: Translation;
}) {
  return (
    <div className="entry-filter-panel" aria-label={t.entries.filterAria}>
      <div className="entry-filter-label">
        <Store aria-hidden="true" size={15} />
        {t.entries.filterLabel}
      </div>
      <div className="entry-filter-chips">
        {options.map((option) => (
          <button
            className={
              selectedFilter === option.value
                ? `entry-filter-chip active ${option.accent ? `accent-${option.accent}` : ""}`
                : `entry-filter-chip ${option.accent ? `accent-${option.accent}` : ""}`
            }
            key={option.value}
            onClick={() => onSelectFilter(option.value)}
            type="button"
          >
            <span className="filter-dot" aria-hidden="true" />
            <span>{option.label}</span>
            <strong>{option.count}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductPicker({
  isCreating,
  newProductName,
  onCreateProduct,
  onNewProductNameChange,
  onSelectProduct,
  productError,
  products,
  selectedProductId,
  t
}: {
  isCreating: boolean;
  newProductName: string;
  onCreateProduct: () => void;
  onNewProductNameChange: (value: string) => void;
  onSelectProduct: (productId: string) => void;
  productError: string | null;
  products: StallProduct[];
  selectedProductId: string;
  t: Translation;
}) {
  return (
    <div className="product-picker" aria-label={t.productPicker.aria}>
      <div className="product-picker-head">
        <span>
          <Store aria-hidden="true" size={15} />
          {t.productPicker.title}
        </span>
        <button
          className={!selectedProductId ? "product-chip selected" : "product-chip"}
          onClick={() => onSelectProduct("")}
          type="button"
        >
          {t.productPicker.autoDetect}
        </button>
      </div>

      {products.length ? (
        <div className="product-chip-row">
          {products.map((product) => (
            <button
              className={
                selectedProductId === product.id
                  ? `product-chip selected accent-${product.accent}`
                  : `product-chip accent-${product.accent}`
              }
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              type="button"
            >
              <span aria-hidden="true" />
              {product.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="product-empty">{t.productPicker.empty}</p>
      )}

      <div className="product-add-row">
        <label className="sr-only" htmlFor="product-input">
          {t.productPicker.inputLabel}
        </label>
        <input
          id="product-input"
          onChange={(event) => onNewProductNameChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onCreateProduct();
            }
          }}
          placeholder={t.productPicker.placeholder}
          value={newProductName}
        />
        <button
          className="secondary-button"
          disabled={isCreating}
          onClick={onCreateProduct}
          type="button"
        >
          {isCreating ? (
            <Loader2 className="spin" aria-hidden="true" size={15} />
          ) : (
            <Plus aria-hidden="true" size={15} />
          )}
          {t.productPicker.add}
        </button>
      </div>

      {productError ? <p className="product-error">{productError}</p> : null}
    </div>
  );
}

function ActivityPanel({
  activity,
  loadState,
  locale,
  t
}: {
  activity: ActivityResponse | null;
  loadState: LoadState;
  locale: Locale;
  t: Translation;
}) {
  const summary = activity?.summary;
  const days = activity?.days ?? [];

  return (
    <section className="activity-section" aria-label={t.activity.aria}>
      <div className="section-heading activity-heading">
        <div>
          <p className="section-kicker">{t.activity.kicker}</p>
          <h2>{t.activity.title}</h2>
        </div>
        <div className="activity-range">
          {summary
            ? `${formatMonthDay(summary.from, locale)} - ${formatMonthDay(summary.to, locale)}`
            : t.activity.rangeFallback}
        </div>
      </div>

      <div className="activity-board">
        <div className="activity-summary">
          <ActivityStat label={t.activity.promoTotal} value={summary?.promoTotal ?? 0} />
          <ActivityStat label={t.activity.codeTotal} value={summary?.codeTotal ?? 0} />
          <ActivityStat label={t.activity.promoDays} value={summary?.promoActiveDays ?? 0} />
          <ActivityStat label={t.activity.codeDays} value={summary?.codeActiveDays ?? 0} />
          <ActivityStat label={t.activity.overlapDays} value={summary?.overlapDays ?? 0} />
        </div>

        {loadState === "loading" ? (
          <div className="activity-placeholder">
            <Loader2 className="spin" aria-hidden="true" size={22} />
            <span>{t.activity.loading}</span>
          </div>
        ) : days.length ? (
          <div className="heatmap-pair" aria-label={t.activity.pairAria}>
            <Heatmap
              days={days}
              kind="promo"
              label={t.activity.promoLabel}
              maxCount={summary?.maxPromoCount ?? 0}
              t={t}
            />
            <Heatmap
              days={days}
              kind="code"
              label={t.activity.codeLabel}
              maxCount={summary?.maxCodeCount ?? 0}
              t={t}
            />
          </div>
        ) : (
          <div className="activity-placeholder">
            <span>{t.activity.noData}</span>
          </div>
        )}

        {summary?.codeSource !== "github" ? (
          <p className="activity-note">{t.activity.note}</p>
        ) : null}
      </div>
    </section>
  );
}

function ActivityStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Heatmap({
  days,
  kind,
  label,
  maxCount,
  t
}: {
  days: ActivityDay[];
  kind: "promo" | "code";
  label: string;
  maxCount: number;
  t: Translation;
}) {
  const weeks = buildCalendarWeeks(days);
  const total = days.reduce(
    (sumValue, day) => sumValue + (kind === "promo" ? day.promoCount : day.codeCount),
    0
  );

  return (
    <div className={`heatmap-row heatmap-${kind}`}>
      <div className="heatmap-label">
        {kind === "promo" ? (
          <Megaphone aria-hidden="true" size={16} />
        ) : (
          <Code2 aria-hidden="true" size={16} />
        )}
        <span>{label}</span>
        <strong>{total}</strong>
      </div>
      <div className="heatmap-scroll">
        <div
          className="heatmap-grid"
          role="img"
          aria-label={formatMessage(t.activity.heatmapAria, { label })}
        >
          {weeks.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const count = day ? (kind === "promo" ? day.promoCount : day.codeCount) : 0;
              const dayLabel = day
                ? formatMessage(t.activity.heatmapCell, {
                    date: day.date,
                    label,
                    count
                  })
                : undefined;

              return (
                <span
                  aria-label={dayLabel}
                  className="heat-cell"
                  data-level={getHeatLevel(count, maxCount)}
                  key={`${kind}-${weekIndex}-${dayIndex}`}
                  title={dayLabel}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function buildCalendarWeeks(days: ActivityDay[]) {
  const weeks: Array<Array<ActivityDay | null>> = [];
  let currentWeek: Array<ActivityDay | null> = [];
  const firstDay = days[0] ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;

  for (let index = 0; index < firstDay; index += 1) {
    currentWeek.push(null);
  }

  for (const day of days) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function getHeatLevel(count: number, maxCount: number) {
  if (count <= 0 || maxCount <= 0) {
    return 0;
  }

  const ratio = count / maxCount;

  if (ratio >= 0.75) {
    return 4;
  }

  if (ratio >= 0.5) {
    return 3;
  }

  if (ratio >= 0.25) {
    return 2;
  }

  return 1;
}

async function fetchActivity(t: Translation) {
  const response = await fetch("/api/activity");
  const payload = (await response.json()) as ActivityResponse | { message?: string };

  if (!response.ok || !("days" in payload)) {
    throw new Error(t.errors.loadActivity);
  }

  return payload;
}

async function fetchProducts(t: Translation) {
  const response = await fetch("/api/products");
  const payload = (await response.json()) as { products?: StallProduct[]; message?: string };

  if (!response.ok || !payload.products) {
    throw new Error(payload.message ?? t.errors.loadProducts);
  }

  return payload.products;
}

function upsertProduct(products: StallProduct[], product: StallProduct) {
  const nextProducts = products.some((item) => item.id === product.id)
    ? products.map((item) => (item.id === product.id ? product : item))
    : [...products, product];

  return nextProducts.sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
  );
}

function buildEntryFilterOptions(
  entries: StallEntry[],
  products: StallProduct[],
  t: Translation
) {
  const options = new Map<string, EntryFilterOption>([
    [
      ALL_ENTRIES_FILTER,
      {
        value: ALL_ENTRIES_FILTER,
        label: t.entries.allProjects,
        count: entries.length
      }
    ]
  ]);

  for (const product of products) {
    options.set(`product:${product.id}`, {
      value: `product:${product.id}`,
      label: product.name,
      count: 0,
      accent: product.accent
    });
  }

  let unassignedCount = 0;

  for (const entry of entries) {
    const filterValue = getEntryFilterValue(entry, products);

    if (filterValue === UNASSIGNED_ENTRIES_FILTER) {
      unassignedCount += 1;
      continue;
    }

    const option = options.get(filterValue);

    if (option) {
      option.count += 1;
      continue;
    }

    options.set(filterValue, {
      value: filterValue,
      label: entry.productName ?? t.entries.untitledProject,
      count: 1,
      accent: entry.accent
    });
  }

  if (unassignedCount) {
    options.set(UNASSIGNED_ENTRIES_FILTER, {
      value: UNASSIGNED_ENTRIES_FILTER,
      label: t.entries.unassigned,
      count: unassignedCount,
      accent: "ink"
    });
  }

  return [...options.values()];
}

function getEntryFilterValue(entry: StallEntry, products: StallProduct[]) {
  if (entry.productId) {
    return `product:${entry.productId}`;
  }

  if (entry.productName) {
    const matchedProduct = products.find((product) => product.name === entry.productName);
    return matchedProduct ? `product:${matchedProduct.id}` : `name:${entry.productName}`;
  }

  return UNASSIGNED_ENTRIES_FILTER;
}

function refreshActivity(
  setActivity: (activity: ActivityResponse) => void,
  setActivityState: (state: LoadState) => void,
  t: Translation
) {
  setActivityState("loading");
  fetchActivity(t)
    .then((payload) => {
      setActivity(payload);
      setActivityState("ready");
    })
    .catch(() => {
      setActivityState("error");
    });
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StallCard({
  entry,
  locale,
  t
}: {
  entry: StallEntry;
  locale: Locale;
  t: Translation;
}) {
  return (
    <article className={`stall-card accent-${entry.accent}`}>
      <div className="card-canopy" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span>
            <CalendarDays aria-hidden="true" size={15} />
            {formatDay(entry.createdAt, locale)}
          </span>
          {entry.productName ? (
            <span>
              <Store aria-hidden="true" size={15} />
              {entry.productName}
            </span>
          ) : null}
          <span>
            <Megaphone aria-hidden="true" size={15} />
            {labelStallType(entry.stallType, t)}
          </span>
        </div>

        <h3>{entry.title}</h3>
        <p>{entry.description}</p>

        <TagGroup icon={<Tag aria-hidden="true" size={14} />} tags={entry.productTags} />
        <TagGroup tags={[...entry.channelTags, ...entry.moodTags]} />

        {entry.sourceUrl ? (
          <a className="source-link" href={entry.sourceUrl} rel="noreferrer" target="_blank">
            {t.card.openSource}
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function TagGroup({ icon, tags }: { icon?: React.ReactNode; tags: string[] }) {
  return (
    <div className="tag-row">
      {icon}
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

function labelStallType(stallType: string, t: Translation) {
  return t.stallTypes[stallType as keyof typeof t.stallTypes] ?? t.stallTypes.fallback;
}

function formatDay(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function formatMonthDay(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(`${value}T00:00:00`));
}
