---
title: Troubleshooting
description: Common errors and how to resolve them when using the Machine Translation API.
sidebar_position: 2
---

# Troubleshooting

## HTTP error reference

### 401 Unauthorized

Your access token is missing, expired, or does not include the required scopes.

**Fix:** Re-request a token and confirm you are requesting the `data:read` scope. Check that the token is passed in the `Authorization: Bearer <token>` header.

### 400 Bad Request

The request body is malformed or a required field is missing.

**Fix:** Verify that `sourceLanguageCode`, `targetLanguageCode`, and `textToTranslate` are all present and non-empty. Each `textToTranslate` item must include a `source` field. Confirm the request body is valid JSON with `Content-Type: application/json`.

### 422 Unprocessable Entity

The source or target language code is not recognized by the API.

**Fix:** Call `GET /languages` to retrieve the current list of supported BCP-47 language codes and confirm your values match exactly.

### 404 Not Found

The requested translation service or language pair is not available.

**Fix:** Call `GET /languages` to confirm that both `sourceLanguageCode` and `targetLanguageCode` are supported. Remember that the source language must be `en-US` or `en-GB`, and the en-GB ↔ en-US swap rule applies (when source is `en-GB`, target must be `en-US` and vice versa).

### 429 Too Many Requests

You have exceeded the rate limit for this API.

**Fix:** Implement exponential backoff and retry using the delay specified in the `Retry-After` response header.

### 500 Internal Server Error

An unexpected error occurred on the server side.

**Fix:** Retry the request. If the error persists, check the [APS Status Page](https://aps.autodesk.com) or contact support.

## Checklist

Before opening a support ticket, verify the following:

- [ ] Token is valid and not expired
- [ ] Token includes the required scope (`data:read`)
- [ ] Request body is valid JSON
- [ ] `sourceLanguageCode` is `en-US` or `en-GB`; `targetLanguageCode` is a supported BCP-47 target code
- [ ] Both `sourceLanguageCode` and `targetLanguageCode` are supported (call `GET /languages` to verify)
- [ ] You are not exceeding the rate limit

## Getting help

Open an issue at the [APS developer forums](https://aps.autodesk.com) or contact Autodesk Platform Services support.
