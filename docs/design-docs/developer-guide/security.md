---
title: Security and Tokens
description: Core security concepts, token lifetimes, and best practices for the Design Automation API.
sidebar_position: 2
---

# Security and Tokens

## How tokens work

The Design Automation API uses OAuth 2.0 bearer tokens for authentication. Every API request must include a valid token in the `Authorization` header.

## Token types

| Token | Lifetime | Use case |
|-------|----------|---------|
| Access token | Short-lived (typically 1 hour) | Authenticate API calls |
| Refresh token | Longer-lived, revocable | Obtain new access tokens without re-authentication |

## Scopes

Tokens carry scopes that define what actions they can perform. Request only the scopes your application needs.

| Scope | Description |
|-------|-------------|
| `code:all` | Full access to Design Automation — activities, AppBundles, WorkItems |
| `data:read` | Read access to Object Storage (input files) |
| `data:write` | Write access to Object Storage (output files) |
| `data:create` | Create new objects in Object Storage |

## OAuth flows

| Flow | When to use |
|------|------------|
| Client credentials (2-legged) | Server-to-server calls; your app acts on its own behalf |
| Authorization code (3-legged) | Calls on behalf of a specific user |

## Best practices

- Store tokens server-side only — never expose them in client-side code or logs.
- Use HTTPS for all requests.
- Implement token rotation and handle `401` responses by refreshing the token.
- Revoke tokens that are no longer needed.

## Related topics

- [Authentication Reference](../reference/auth)
- [Implement the Authorization Code Flow](../how-to-guide/oauth-auth-code)
