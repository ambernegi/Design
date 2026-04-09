---
title: MT-API HTTP Reference
description: HTTP API reference for the Autodesk Machine Translation API v1.0.57
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
| `data:write` | Modify translation settings and preferences |
| `data:create` | Create new translation requests and configurations |
