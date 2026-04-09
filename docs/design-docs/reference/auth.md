---
title: Authentication API Reference
description: Detailed reference for the authentication and token endpoints.
tags:
  - reference
  - authentication
  - oauth
category: Reference
status: draft
version: v1
last_updated: 2025-11-28
---

## Purpose

Provide precise, implementation-focused details about authentication-related endpoints.

## Endpoints

### `POST /oauth/token`

Issue access tokens (and optionally refresh tokens) for supported grant types.

**Request**

- **URL**: `/oauth/token`
- **Method**: `POST`
- **Auth**: Basic auth with `client_id:client_secret` or form parameters.

**Common parameters**

- `grant_type` (string, required)  
  One of: `authorization_code`, `client_credentials`, `refresh_token`.
- `scope` (string, optional)  
  Space-separated list of scopes.

**Response**

Returns a JSON object:

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "string (optional)",
  "scope": "read write"
}
```

## Error responses

- `400 Bad Request` – Invalid or missing parameters.
- `401 Unauthorized` – Invalid client credentials.
- `429 Too Many Requests` – Rate limit exceeded.

## Related topics

- OAuth Overview
- Implement the Authorization Code Flow


