---
title: Quickstart
description: Get up and running quickly with a minimal end-to-end Design Automation example.
sidebar_position: 1
---

# Quickstart

This guide walks you through the minimal steps to submit your first Design Automation WorkItem.

## Prerequisites

- An APS account and a registered application at the [APS Portal](https://aps.autodesk.com)
- A **Client ID** and **Client Secret** for your application
- Basic familiarity with HTTP and JSON

## Step 1 — Obtain an access token

Use the client credentials flow to get a 2-legged token with the `code:all`, `data:read`, `data:write`, and `data:create` scopes.

```bash
curl -X POST \
  https://developer.api.autodesk.com/authentication/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=<CLIENT_ID>" \
  -d "client_secret=<CLIENT_SECRET>" \
  -d "scope=code:all data:read data:write data:create"
```

## Step 2 — Register an AppBundle

Upload your automation code (DLL, script, or plugin) to Design Automation.

```bash
curl -X POST \
  https://developer.api.autodesk.com/da/us-east/v3/appbundles \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "MyAppBundle",
    "engine": "Autodesk.AutoCAD+24",
    "description": "My first AppBundle"
  }'
```

## Step 3 — Define an Activity

Describe what your AppBundle does and what inputs/outputs it expects.

```bash
curl -X POST \
  https://developer.api.autodesk.com/da/us-east/v3/activities \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "MyActivity",
    "commandLine": ["$(engine.path)\\accoreconsole.exe /i $(args[inputFile].path) /s $(appbundles[MyAppBundle].path)\\script.scr"],
    "engine": "Autodesk.AutoCAD+24",
    "appbundles": ["<YOUR_NICKNAME>.MyAppBundle+prod"]
  }'
```

## Step 4 — Submit a WorkItem

Run the Activity against an input file.

```bash
curl -X POST \
  https://developer.api.autodesk.com/da/us-east/v3/workitems \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "activityId": "<YOUR_NICKNAME>.MyActivity+prod",
    "arguments": {
      "inputFile": { "url": "<SIGNED_URL_TO_INPUT>" },
      "outputFile": { "url": "<SIGNED_URL_FOR_OUTPUT>", "verb": "put" }
    }
  }'
```

## Step 5 — Poll for completion

```bash
curl -X GET \
  https://developer.api.autodesk.com/da/us-east/v3/workitems/<WORKITEM_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

When `status` is `success`, retrieve your output file from the signed output URL.

## Next steps

- [Security and Tokens](../developer-guide/security) — understand authentication in depth
- [Authorization Code Flow](./oauth-auth-code) — act on behalf of a user
- [Reference](../reference/auth) — full endpoint documentation
