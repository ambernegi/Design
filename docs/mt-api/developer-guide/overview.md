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
| Language code | BCP-47 language tags. **Source** is restricted to `en-US` or `en-GB`. **Target** supports 17 languages — call `GET /languages` for the full list. |
| 2-legged auth | Client credentials flow — for server-to-server calls on behalf of your app |
| 3-legged auth | Authorization code flow — for calls on behalf of a specific user |

:::note
When source is `en-GB`, target must be `en-US` and vice versa. Each request can contain 1–20 text items for translation.
:::

## Base URL

```
https://developer.api.autodesk.com/languagetranslation/v1
```

## Authentication

All endpoints require an OAuth 2.0 bearer token. Request the following scopes when obtaining your token:

| Scope | Purpose |
|-------|---------|
| `data:read` | Read translation data and settings |

Token URL: `https://developer.api.autodesk.com/authentication/v2/token`

## Before you begin

1. Register your app at the [APS Portal](https://aps.autodesk.com).
2. Enable the `data:read` scope for your app.
3. Obtain an access token using the OAuth 2.0 client credentials flow.
4. Call `GET /languages` to confirm your target language is supported.
