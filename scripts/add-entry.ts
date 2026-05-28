import { getPool } from "../lib/db";
import { createStallEntry } from "../lib/stalls";

const rawInput = process.argv.slice(2).join(" ").trim();

if (!rawInput) {
  console.error("Usage: npm run entry:add -- \"今天出摊记录或链接\"");
  process.exit(1);
}

main();

async function main() {
  try {
    const entry = await createStallEntry(rawInput);

    console.log(
      JSON.stringify(
        {
          id: entry.id,
          title: entry.title,
          productTags: entry.productTags,
          channelTags: entry.channelTags,
          moodTags: entry.moodTags,
          sourceUrl: entry.sourceUrl,
          createdAt: entry.createdAt
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await getPool().end();
  }
}
