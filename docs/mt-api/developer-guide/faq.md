---
title: FAQ
description: Frequently asked questions about the Machine Translation API.
sidebar_position: 3
---

# FAQ

## What languages are supported?

Call `GET /languages` to retrieve the current list. The API supports major world languages identified by BCP-47 language codes such as `en-US`, `fr-FR`, `de-DE`, and `ja-JP`.

## Is machine translation output production-quality?

The API uses neural machine translation, which is suitable for many workflows including developer tools, UI strings, and informal content. For high-stakes content — legal documents, safety-critical instructions, or medical text — review the output with a qualified human translator.

## What is the maximum content size per request?

Refer to the [POST /machine-translate](../v1/reference/http/mt-api/post-machine-translate) endpoint documentation for request body size limits and field constraints.

## Does the API store my content?

Translation requests are not stored after the response is returned. See Autodesk's [Privacy Statement](https://www.autodesk.com/company/legal-notices-trademarks/privacy-statement) for full details.

## How do I get API credentials?

1. Sign in to the [APS Portal](https://aps.autodesk.com).
2. Create a new application.
3. Copy the Client ID and Client Secret from the app credentials page.
4. Use these credentials to obtain an OAuth 2.0 access token.

## Can I use this API in a frontend application?

The Machine Translation API requires a server-side OAuth token with `data:create` scope. To use it from a frontend, proxy requests through your own backend service rather than exposing credentials in the browser.

## What happens if a language pair is unsupported?

The API returns a `422 Unprocessable Entity` response. Call `GET /languages` to verify which source-target pairs are supported before submitting a translation request.
