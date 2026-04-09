---
title: Get API Version
description: Retrieves the current version of the Machine Translation API.
sidebar_position: 2
---

# Get API Version

`GET` `https://developer.api.autodesk.com/languagetranslation/v1/version`

Retrieves the current version of the Machine Translation API. Use this operation to verify API compatibility and track version changes.

## Authentication

No authentication required.

## Request

This operation has no request parameters or request body.

## Response

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | The API version information was successfully retrieved. |

### Response Body — 200 OK

API version information response containing the current version number.

| Property | Type | Description |
|----------|------|-------------|
| `version` | `string` | The current version number of the Machine Translation API. |

**Example**

```json
{
  "version": "1.24"
}
```
