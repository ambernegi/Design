---
title: Overview
description: Introduction to the Machine Translation API — what it does, when to use it, and how it fits into your workflow.
sidebar_position: 1
---

# Overview

The Machine Translation API provides programmatic access to Autodesk's neural machine translation service. Use it to translate text content across languages directly within your application workflows.

## When to use this API

- Localizing user-generated content or CAD annotations at scale
- Translating documentation, help text, or UI strings in APS integrations
- Building multilingual collaboration features into your Autodesk application

## Key concepts

| Concept | Description |
|---------|-------------|
| Translation request | A single call to `POST /machine-translate` with source text and a target language |
| Language code | BCP-47 language tags, e.g. `en-US`, `fr-FR`, `ja-JP` |
| 2-legged auth | Client credentials flow — for server-to-server calls on behalf of your app |
| 3-legged auth | Authorization code flow — for calls on behalf of a specific user |

## Base URL

```
https://developer.api.autodesk.com/languagetranslation/v1
```

## Authentication

All endpoints require an OAuth 2.0 bearer token. Request the following scopes when obtaining your token:

| Scope | Purpose |
|-------|---------|
| `data:read` | Read translation data and settings |
| `data:write` | Modify translation settings and preferences |
| `data:create` | Submit new translation requests |

Token URL: `https://developer.api.autodesk.com/authentication/v2/token`

## Before you begin

1. Register your app at the [APS Portal](https://aps.autodesk.com).
2. Enable the `data:read` and `data:create` scopes for your app.
3. Obtain an access token using the OAuth 2.0 client credentials flow.
4. Call `GET /languages` to confirm your target language is supported.
