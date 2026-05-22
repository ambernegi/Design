---
title: MT-API HTTP Reference
description: HTTP API reference for the Autodesk Machine Translation API
sidebar_position: 1
---

# MT-API — HTTP Reference

Base URL: `https://developer.api.autodesk.com/languagetranslation/v1`

Machine translation API provided by Autodesk localization team.

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `POST` | `/machine-translate` | [Machine Translate](./post-machine-translate.md) |
| `GET` | `/version` | [Get API Version](./get-version.md) |
| `GET` | `/languages` | [List Supported Languages](./get-languages.md) |

## Authentication

This API uses OAuth 2.0. Two authentication contexts are supported:

| Context | Flow | Use when |
|---------|------|----------|
| 2-legged | Client Credentials | Making API calls on behalf of your application |
| 3-legged | Authorization Code | Making API calls on behalf of a specific user |

Token URL: `https://developer.api.autodesk.com/authentication/v2/token`

### Scopes

| Scope | Description |
|-------|-------------|
| `data:read` | Read access to translation data and settings |

## Errors

All endpoints in this API return a shared error envelope for any `4xx` or `5xx` response.

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | A brief, human-readable summary of the error. Examples: `"Bad Request"`, `"Unauthorized"`, `"Not Found"`. |
| `detail` | `string` | A detailed description of the error, including specific information about what went wrong and how to fix it. |

**Example**

```json
{
  "title": "Bad Request",
  "detail": "sourceLanguageCode is missing."
}
```
