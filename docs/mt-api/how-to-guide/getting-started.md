---
title: Getting Started
description: Make your first successful translation request in minutes.
sidebar_position: 1
---

# Getting Started

This guide walks you through making your first successful call to the Machine Translation API.

## Prerequisites

- An APS application registered at the [APS Portal](https://aps.autodesk.com)
- Client ID and Client Secret for your app
- `data:read` scope enabled
- `curl` or an HTTP client of your choice

## Step 1 — Obtain an access token

Use the client credentials (2-legged) flow to get a bearer token:

```bash
curl -X POST \
  https://developer.api.autodesk.com/authentication/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=<YOUR_CLIENT_ID>" \
  -d "client_secret=<YOUR_CLIENT_SECRET>" \
  -d "scope=data:read"
```

Copy the `access_token` value from the response.

## Step 2 — Check available languages

Confirm the languages you need are supported:

```bash
curl -X GET \
  https://developer.api.autodesk.com/languagetranslation/v1/languages \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

The response is a list of supported BCP-47 language codes.

## Step 3 — Submit a translation request

```bash
curl -X POST \
  https://developer.api.autodesk.com/languagetranslation/v1/machine-translate \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceLanguageCode": "en-US",
    "targetLanguageCode": "fr-FR",
    "textToTranslate": [
      { "source": "Hello, world!" }
    ]
  }'
```

## Step 4 — Handle the response

A successful `200` response returns the translated text:

```json
{
  "translations": [
    { "translatedText": "Bonjour, le monde !" }
  ],
  "duration": 0.123,
  "route": {
    "name": "Production general model for fr",
    "source": "^(en|en-us)$",
    "target": "^(fr|fr-fr)$",
    "provider": {
      "name": "microsoft",
      "option": {
        "category": "9489b789-xxxx-4d53-xxxx-3dae52ab73c7-TECH",
        "description": "Production general model for fr"
      }
    }
  }
}
```

## Next steps

- [POST /machine-translate](../v1/reference/http/mt-api/post-machine-translate) — full parameter and schema reference
- [GET /languages](../v1/reference/http/mt-api/get-languages) — list all supported language codes
- [Troubleshooting](../developer-guide/troubleshooting) — common errors and fixes
- [FAQ](../developer-guide/faq) — frequently asked questions
