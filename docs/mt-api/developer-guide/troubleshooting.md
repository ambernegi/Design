---
title: Troubleshooting
description: Common errors and how to resolve them when using the Machine Translation API.
sidebar_position: 2
---

# Troubleshooting

## HTTP error reference

### 401 Unauthorized

Your access token is missing, expired, or does not include the required scopes.

**Fix:** Re-request a token and confirm you are requesting `data:read` and `data:create` scopes. Check that the token is passed in the `Authorization: Bearer <token>` header.

### 400 Bad Request

The request body is malformed or a required field is missing.

**Fix:** Verify that `sourceContent`, `sourceLanguage`, and `targetLanguage` are all present and non-empty. Confirm the request body is valid JSON with `Content-Type: application/json`.

### 422 Unprocessable Entity

The source or target language code is not recognized by the API.

**Fix:** Call `GET /languages` to retrieve the current list of supported BCP-47 language codes and confirm your values match exactly.

### 429 Too Many Requests

You have exceeded the rate limit for this API.

**Fix:** Implement exponential backoff and retry using the delay specified in the `Retry-After` response header.

### 500 Internal Server Error

An unexpected error occurred on the server side.

**Fix:** Retry the request. If the error persists, check the [APS Status Page](https://aps.autodesk.com) or contact support.

## Checklist

Before opening a support ticket, verify the following:

- [ ] Token is valid and not expired
- [ ] Token includes the required scopes (`data:read`, `data:create`)
- [ ] Request body is valid JSON
- [ ] `sourceLanguage` and `targetLanguage` are supported BCP-47 codes
- [ ] You are not exceeding the rate limit

## Getting help

Open an issue at the [APS developer forums](https://aps.autodesk.com) or contact Autodesk Platform Services support.
