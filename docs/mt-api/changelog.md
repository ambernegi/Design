---
id: changelog
title: "Machine Translation API Changelog"
sidebar_label: "Changelog"
slug: "/mt-api/changelog"
---

# Machine Translation API Changelog

This changelog tracks version changes and updates to the Machine Translation API. It follows the [Keep a Changelog](https://keepachangelog.com/) format. All notable changes to the API are documented here to help developers track new features, improvements, deprecations, and breaking changes across releases.

---

## v1.0.57 (Current)

This is the baseline changelog entry for the Machine Translation API. Version 1.0.57 represents the current production release of the API as documented in the HTTP reference.

### Available Endpoints

- **POST /machine-translate** — Translate text content from a source language to a target language. Supports batch translation of 1–20 text items per request.
- **GET /version** — Retrieve the current API version number.
- **GET /languages** — List all supported languages and their Autodesk NMT availability.

### Supported Features

- **OAuth 2.0 authentication** — Both 2-legged (client credentials) and 3-legged (authorization code) flows are supported.
- **Batch translation** — Translate up to 20 text items in a single request to `POST /machine-translate`.
- **17 target languages** — Supported targets include Chinese (Simplified and Traditional), Czech, Danish, Dutch, English (UK), French, German, Hungarian, Italian, Japanese, Korean, Polish, Portuguese (Brazil), Russian, Spanish, and Swedish.
- **Autodesk NMT support** — Autodesk Neural Machine Translation is available for select language pairs, providing higher-quality translations for Autodesk-specific terminology. Use `GET /languages` to check NMT availability for each language.
- **Source language constraint** — Source language must be `en-US` or `en-GB`. When source is `en-GB`, the only valid target is `en-US`.
- **Translation routing metadata** — The response includes routing information about the translation provider and model used for each request.
