---
title: Security and Tokens
description: Core security concepts, token lifetimes, and best practices.
tags:
  - concepts
  - security
  - oauth
category: Concepts
status: draft
version: v1
last_updated: 2025-11-28
---

## Purpose

Explain how tokens work, how long they last, and how to use them securely in your integrations.

## Key concepts

- **Access token**: Short-lived credential used to call APIs.
- **Refresh token**: Longer-lived credential used to obtain new access tokens.
- **Scopes**: Fine-grained permissions associated with tokens.

## Token lifetimes

- Access tokens are intentionally short-lived (for example, 1 hour).
- Refresh tokens typically live longer but can be revoked at any time.

## Best practices

- Store tokens securely on the server side.
- Never log tokens or expose them to untrusted parties.
- Use HTTPS for all communication.
- Implement token rotation and revocation handling.

## Related topics

- OAuth Overview
- Authentication API Reference


