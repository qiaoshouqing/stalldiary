# AI / Automation Save Endpoint

Use this endpoint when an AI assistant needs to save a stall log entry without using the website form.

## Endpoint

```http
POST https://your-stalldiary.example.com/api/agent/stalls
Authorization: Bearer <AGENT_WRITE_TOKEN>
Content-Type: application/json
```

Maintainer production endpoint:

```http
POST https://stalldiary.pomodiary.com/api/agent/stalls
Authorization: Bearer <AGENT_WRITE_TOKEN>
Content-Type: application/json
```

Compatibility path:

```http
POST https://your-stalldiary.example.com/api/scale/stalls
```

For this deployment, the compatibility path is:

```http
POST https://stalldiary.pomodiary.com/api/scale/stalls
```

## Body

Preferred:

```json
{
  "productName": "StallDiary",
  "rawInput": "Posted a new product update: https://example.com"
}
```

Split fields are also accepted:

```json
{
  "productName": "StallDiary",
  "text": "Posted a new product update",
  "url": "https://example.com",
  "note": "Main product: StallDiary"
}
```

If you already know the product ID from `/api/products`, pass `productId` instead of `productName`.

Use `dryRun` to test parsing without writing to the database:

```json
{
  "rawInput": "Posted a new product update: https://example.com",
  "dryRun": true
}
```

## AI Instruction

When the user asks you to record a stall log, call the save endpoint with the full message in `rawInput`. If the user gives a URL and extra notes separately, send both. If the user names a product, send it as `productName`. After saving, summarize the returned `title`, `productTags`, `channelTags`, and `moodTags`.

Do not expose the bearer token in messages. Store it as a secret in the AI platform.
