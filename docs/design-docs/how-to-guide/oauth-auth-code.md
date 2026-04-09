---
title: Implement the Authorization Code Flow
description: Step-by-step guide to implementing the OAuth Authorization Code flow for the Design Automation API.
sidebar_position: 2
---

# Implement the Authorization Code Flow

Use this guide when your application needs to act on behalf of a specific Autodesk user — for example, accessing files from that user's BIM 360 or Fusion hub.

## When to use this flow

- Your app needs access to user-owned resources (files, projects, hubs)
- You require the user's explicit consent before accessing their data
- Your backend can securely store a client secret

## Prerequisites

- Application registered at the [APS Portal](https://aps.autodesk.com)
- **Client ID**, **Client Secret**, and a **redirect URI** configured in your app settings
- A backend server that can securely hold the client secret

## Step 1 — Redirect the user to authorize

Send the user to the Autodesk authorization endpoint. Include your scopes and a `state` parameter to protect against CSRF.

```
GET https://developer.api.autodesk.com/authentication/v2/authorize
  ?response_type=code
  &client_id=<CLIENT_ID>
  &redirect_uri=<REDIRECT_URI>
  &scope=data:read data:write code:all
  &state=<RANDOM_OPAQUE_VALUE>
```

## Step 2 — Handle the callback

After the user approves, Autodesk redirects to your `redirect_uri` with a `code` parameter.

```
GET https://your-app.com/callback?code=<AUTH_CODE>&state=<STATE>
```

Verify that the `state` matches what you sent in Step 1 before proceeding.

## Step 3 — Exchange the code for tokens

```bash
curl -X POST \
  https://developer.api.autodesk.com/authentication/v2/token \
  -u "<CLIENT_ID>:<CLIENT_SECRET>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=<AUTH_CODE>" \
  -d "redirect_uri=<REDIRECT_URI>"
```

A successful response:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "..."
}
```

## Step 4 — Refresh the token

When the access token expires, use the refresh token to get a new one without requiring the user to re-authorize.

```bash
curl -X POST \
  https://developer.api.autodesk.com/authentication/v2/token \
  -u "<CLIENT_ID>:<CLIENT_SECRET>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=<REFRESH_TOKEN>"
```

## Security considerations

- Never expose the client secret or tokens in frontend code.
- Always validate the `state` parameter in the callback.
- Use HTTPS for all requests and redirect URIs.
- Handle token revocation — if a refresh token is revoked, prompt the user to re-authorize.

## Related topics

- [Security and Tokens](../developer-guide/security)
- [Authentication Reference](../reference/auth)
