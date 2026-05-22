---
title: Batch Translation
description: Translate multiple text items in a single request and map results back to their sources.
sidebar_position: 2
---

# Batch Translation

The Machine Translation API accepts up to 20 text items in a single `POST /machine-translate` request. Batching reduces network overhead and lets you translate a list of strings (for example, UI labels or a paragraph split into sentences) with one call.

This guide walks through building a batch request, calling the API, and mapping each translated result back to its source item.

## Prerequisites

- Completed [Getting Started](./getting-started) at least once with a single-item request
- A valid access token with the `data:read` scope
- A list of 2–20 source text items in `en-US` or `en-GB`

## Step 1 — Obtain an access token

If you do not already have a token, follow [Getting Started — Step 1](./getting-started#step-1--obtain-an-access-token) to fetch one using the client credentials flow.

## Step 2 — Build a batch request body

Put each source string into its own object in the `textToTranslate` array. Each `textToTranslate` item must be unique within the request.

```json
{
  "sourceLanguageCode": "en-US",
  "targetLanguageCode": "de-DE",
  "textToTranslate": [
    { "source": "Open file" },
    { "source": "Save changes" },
    { "source": "Close without saving" },
    { "source": "Export as PDF" }
  ]
}
```

Constraints to keep in mind:

- Minimum 1 item, maximum 20 items per request
- `sourceLanguageCode` must be `en-US` or `en-GB`
- When source is `en-GB`, target must be `en-US`, and vice versa

## Step 3 — Call POST /machine-translate

Send the body from Step 2 to the endpoint:

```bash
curl -X POST \
  https://developer.api.autodesk.com/languagetranslation/v1/machine-translate \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceLanguageCode": "en-US",
    "targetLanguageCode": "de-DE",
    "textToTranslate": [
      { "source": "Open file" },
      { "source": "Save changes" },
      { "source": "Close without saving" },
      { "source": "Export as PDF" }
    ]
  }'
```

A successful `200` response returns a `translations` array of the same length as your input:

```json
{
  "translations": [
    { "translatedText": "Datei öffnen" },
    { "translatedText": "Änderungen speichern" },
    { "translatedText": "Schließen ohne zu speichern" },
    { "translatedText": "Als PDF exportieren" }
  ],
  "duration": 0.284,
  "route": {
    "name": "Production general model for de",
    "source": "^(en|en-us)$",
    "target": "^(de|de-de)$",
    "provider": {
      "name": "microsoft",
      "option": {
        "category": "9489b789-xxxx-4d53-xxxx-3dae52ab73c7-TECH",
        "description": "Production general model for de"
      }
    }
  }
}
```

## Step 4 — Map results back to source items

The response preserves order: `translations[i].translatedText` corresponds to `textToTranslate[i].source` from the request. Iterate the two arrays by index to pair source and target.

Example using `jq` to print `source -> translatedText` pairs from a saved request and response:

```bash
paste \
  <(jq -r '.textToTranslate[].source' request.json) \
  <(jq -r '.translations[].translatedText' response.json) \
  | awk -F'\t' '{ printf "%s -> %s\n", $1, $2 }'
```

In application code, zip the request and response arrays by index — no key matching is required because the API guarantees positional correspondence.

## Next steps

- [POST /machine-translate](../v1/reference/http/mt-api/post-machine-translate) — full request and response schema
- [Rate Limits](../developer-guide/rate-limits) — quotas and backoff guidance for high-volume batching
- [Troubleshooting](../developer-guide/troubleshooting) — common batch errors (400, 422, 429)
