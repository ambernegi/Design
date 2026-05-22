---
title: Rate Limits
description: How the Machine Translation API enforces rate limits and how to back off gracefully.
sidebar_position: 4
---

# Rate Limits

The Machine Translation API enforces per-application rate limits to keep the service responsive for all clients. Quotas are applied per APS application (Client ID), not per access token, so issuing additional tokens does not increase your allowance.

## How rate limiting works

When a request would exceed the current quota, the API returns a `429 Too Many Requests` response with a `Retry-After` header indicating how many seconds to wait before retrying.

### Example response

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/json

{
  "title": "Too Many Requests",
  "detail": "Rate limit exceeded. Retry after 30 seconds."
}
```

### `Retry-After` header

| Header | Type | Description |
| --- | --- | --- |
| `Retry-After` | integer | Number of seconds to wait before issuing the next request. |

## Handling 429 responses

Always honour the `Retry-After` value. If you ignore it and retry immediately, subsequent requests will continue to be rejected and may extend the cooldown window.

### Recommended pattern — exponential backoff with `Retry-After`

The example below retries a failed translation request up to five times, waiting for the longer of the `Retry-After` value or an exponentially growing delay between attempts:

```bash
#!/usr/bin/env bash
set -euo pipefail

URL="https://developer.api.autodesk.com/languagetranslation/v1/machine-translate"
TOKEN="<YOUR_TOKEN>"
BODY='{
  "sourceLanguageCode": "en-US",
  "targetLanguageCode": "fr-FR",
  "textToTranslate": [{ "source": "Hello, world!" }]
}'

attempt=0
max_attempts=5
delay=1

while (( attempt < max_attempts )); do
  response=$(curl -s -o /tmp/mt-body -w "%{http_code} %header{retry-after}" \
    -X POST "$URL" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$BODY")

  status=$(echo "$response" | awk '{print $1}')
  retry_after=$(echo "$response" | awk '{print $2}')

  if [[ "$status" == "200" ]]; then
    cat /tmp/mt-body
    exit 0
  fi

  if [[ "$status" != "429" ]]; then
    echo "Non-retryable error: $status" >&2
    cat /tmp/mt-body >&2
    exit 1
  fi

  wait=${retry_after:-$delay}
  echo "Rate limited. Sleeping ${wait}s before retry $((attempt + 1))/${max_attempts}." >&2
  sleep "$wait"

  attempt=$((attempt + 1))
  delay=$((delay * 2))
done

echo "Exceeded retry budget." >&2
exit 1
```

## Best practices

- **Batch where possible.** A single `POST /machine-translate` request accepts up to 20 items in `textToTranslate`. Combining items into one call counts as one request against the quota — see [Batch translation](../how-to-guide/batch-translation).
- **Cache repeated translations.** Identical `(sourceLanguageCode, targetLanguageCode, source)` tuples produce the same output. Caching results client-side avoids re-translating the same strings.
- **Spread bursts.** Add a small jitter (a few hundred milliseconds) between consecutive requests to avoid synchronised retry storms across multiple workers.
- **Monitor 429 rates.** A rising 429 ratio is an early signal you should request a quota increase before users see failures.

## Quotas and limits

Specific per-application rate-limit values are published on the APS Developer Portal. Sign in to the [APS Portal](https://aps.autodesk.com) and open your application's page to view your current quota. If your workload requires a higher limit, contact Autodesk Platform Services support with your Client ID and expected request volume.

## Related

- [Troubleshooting — 429 Too Many Requests](./troubleshooting#429-too-many-requests)
- [Batch translation](../how-to-guide/batch-translation)
- [FAQ](./faq)
