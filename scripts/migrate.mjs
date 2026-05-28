import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: 1000,
  max: 1
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stall_products (
      id text PRIMARY KEY,
      name text NOT NULL,
      description text NOT NULL DEFAULT '',
      accent text NOT NULL DEFAULT 'coral',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS stall_products_name_lower_idx
      ON stall_products (lower(name));

    CREATE INDEX IF NOT EXISTS stall_products_created_at_idx
      ON stall_products (created_at ASC);

    CREATE TABLE IF NOT EXISTS stall_entries (
      id text PRIMARY KEY,
      product_id text,
      product_name text,
      source_text text NOT NULL,
      source_url text,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      product_tags text[] NOT NULL DEFAULT '{}',
      channel_tags text[] NOT NULL DEFAULT '{}',
      mood_tags text[] NOT NULL DEFAULT '{}',
      stall_type text NOT NULL DEFAULT 'daily',
      accent text NOT NULL DEFAULT 'coral',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS stall_entries_created_at_idx
      ON stall_entries (created_at DESC);

    CREATE INDEX IF NOT EXISTS stall_entries_product_tags_idx
      ON stall_entries USING GIN (product_tags);

    ALTER TABLE stall_entries
      ADD COLUMN IF NOT EXISTS product_id text;

    ALTER TABLE stall_entries
      ADD COLUMN IF NOT EXISTS product_name text;

    CREATE INDEX IF NOT EXISTS stall_entries_product_id_idx
      ON stall_entries (product_id);
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'stall_entries_product_id_fkey'
      ) THEN
        ALTER TABLE stall_entries
          ADD CONSTRAINT stall_entries_product_id_fkey
          FOREIGN KEY (product_id)
          REFERENCES stall_products(id)
          ON DELETE SET NULL;
      END IF;
    END $$;
  `);

  console.log("StallDiary database schema is ready.");
} finally {
  await pool.end();
}
