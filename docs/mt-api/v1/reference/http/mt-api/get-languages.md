---
title: List Supported Languages
description: Retrieves a list of all languages supported by the Machine Translation API.
sidebar_position: 3
---

# List Supported Languages

`GET` `https://developer.api.autodesk.com/languagetranslation/v1/languages`

Retrieves a list of all languages supported by the Machine Translation API. Each language entry includes:

- Language name
- Language code (e.g., en-US, de-DE)
- Availability of Autodesk Neural Machine Translation (NMT) support

## Authentication

| Scheme | Required Scopes |
|--------|-----------------|
| OAuth 2.0 (2-legged) | `data:read` |

## Request

This operation has no request parameters or request body.

## Response

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | The list of supported languages was successfully retrieved. |

### Response Body — 200 OK

Returns an array of language objects.

| Property | Type | Description |
|----------|------|-------------|
| `[].name` | `string` | The human-readable name of the language. Example: `"German"`, `"French"`, `"Japanese"`. |
| `[].code` | `string` | The standardized language code in BCP 47 format. Example: `"de-DE"`, `"fr-FR"`, `"ja-JP"`. |
| `[].AutodeskNMT` | `boolean` | `true` if Autodesk Neural Machine Translation (NMT) is available for this language; `false` otherwise. |

**Example**

```json
[
  {
    "name": "German",
    "code": "de-DE",
    "AutodeskNMT": true
  },
  {
    "name": "French",
    "code": "fr-FR",
    "AutodeskNMT": true
  },
  {
    "name": "Hungarian",
    "code": "hu-HU",
    "AutodeskNMT": false
  }
]
```
