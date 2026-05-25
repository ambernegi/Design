---
name: batch-translate
description: Translate a list of strings via the Autodesk Machine Translation API. Use when the user wants to batch-translate UI labels, message catalogs, or any list of short text items from English to a target language (or vice versa).
---

# Batch Translate Skill

Walk the user through making a single `POST /machine-translate` call with up to 20 items, then map the returned translations back to their source strings by index.

## Inputs to collect

Before generating code or a curl call, gather:

1. **Source language** — must be `en-US` or `en-GB`.
2. **Target language** — for `en-GB` source, target must be `en-US` (and vice versa); otherwise any supported target locale.
3. **Items** — 1 to 20 source strings. If the user supplies a file, read it; if they paste a list, parse it.
4. **Access token** — ask the user to provide one with the `data:read` scope, or point them at the client-credentials flow in [docs/mt-api/how-to-guide/getting-started.md](../../../docs/mt-api/how-to-guide/getting-started.md).

If the user supplies more than 20 items, split into chunks of 20 and call the endpoint once per chunk — do not silently drop items.

## Request shape

```json
{
  "sourceLanguageCode": "en-US",
  "targetLanguageCode": "de-DE",
  "textToTranslate": [
    { "source": "Open file" },
    { "source": "Save changes" }
  ]
}
```

Each `textToTranslate[].source` must be unique within a single request — dedupe before sending and re-expand the response if the user's original list had duplicates.

## Response handling

The API guarantees positional correspondence: `translations[i].translatedText` pairs with `textToTranslate[i].source`. Zip by index — do not key-match.

## Errors to anticipate

- `400` — malformed body or >20 items in `textToTranslate`
- `422` — unsupported language pair (e.g. `en-GB` → `de-DE`)
- `429` — rate limited; back off per [docs/mt-api/developer-guide/rate-limits.md](../../../docs/mt-api/developer-guide/rate-limits.md)

## Output

Produce, in this order:

1. A working `curl` (or, if the user is in a Python/Node project, idiomatic client code) that posts the batch.
2. A short snippet that pairs `source -> translatedText` from the response.
3. A note if the input was chunked or deduplicated, so the user knows what was transformed.
