---
title: Troubleshooting
description: Common errors and how to resolve them when using the Design Automation API.
sidebar_position: 3
---

# Troubleshooting

## Common errors

### 401 Unauthorized

Your access token is missing, expired, or does not include the required scopes.

**Fix:** Re-request a token with `code:all`, `data:read`, `data:write`, and `data:create` scopes.

### 403 Forbidden

Your token is valid but your app does not have permission to perform the operation.

**Fix:** Verify that the AppBundle or Activity you are referencing was created by your own nickname, and that you are using the correct alias (e.g. `+prod`).

### 404 Not Found

The resource (AppBundle, Activity, WorkItem) does not exist or you are referencing the wrong nickname/alias combination.

**Fix:** Confirm the full qualified ID including nickname and alias: `<nickname>.<id>+<alias>`.

### WorkItem fails with `failedInstructions`

The automation code ran but produced an error (e.g. a script error, missing input file, or bad output path).

**Fix:** Download the `report.txt` from the WorkItem response — it contains the full engine log with error details.

### 429 Too Many Requests

You have exceeded the Design Automation rate limit.

**Fix:** Implement exponential backoff. Check the `Retry-After` response header for guidance on when to retry.

## Checklist

Before opening a support ticket, verify:

- [ ] Token is valid and includes `code:all` scope
- [ ] AppBundle and Activity use the correct qualified ID format
- [ ] Input files are accessible via signed URL
- [ ] Output signed URLs have PUT verb permission
- [ ] WorkItem `report.txt` has been checked for engine-level errors

## Getting help

Open an issue at the [APS developer forums](https://aps.autodesk.com) or contact Autodesk Platform Services support.
