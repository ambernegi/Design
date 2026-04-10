---
id: api-reference
title: "Machine Translation API Reference"
sidebar_label: "API Reference"
slug: "/mt-api/v1/reference"
---

# Machine Translation API Reference

## Overview

The Machine Translation API provides programmatic access to Autodesk's neural machine translation service. It is a proxy service under the Localization Services domain that enables developers to translate text content across languages directly within application workflows.

**Base URL:**

```
https://developer.api.autodesk.com/languagetranslation/v1
```

### Available Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `POST` | `/machine-translate` | Translate text content from a source language to a target language |
| `GET` | `/version` | Retrieve the current API version |
| `GET` | `/languages` | List all supported languages and their translation capabilities |

The API supports batch translation of up to 20 text items per request, 17 target languages, and Autodesk Neural Machine Translation (NMT) for select language pairs.

---

## Authentication

The Machine Translation API uses OAuth 2.0 for authentication. Two authentication contexts are supported depending on your use case.

### Supported Flows

| Context | Flow | Use When |
|---------|------|----------|
| 2-legged | Client Credentials | Making API calls on behalf of your application (server-to-server) |
| 3-legged | Authorization Code | Making API calls on behalf of a specific user |

### Token URL

```
https://developer.api.autodesk.com/authentication/v2/token
```

### Obtaining a Token

Use the client credentials (2-legged) flow to obtain a bearer token:

```bash
curl -X POST \
  https://developer.api.autodesk.com/authentication/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=<YOUR_CLIENT_ID>" \
  -d "client_secret=<YOUR_CLIENT_SECRET>" \
  -d "scope=data:read data:create"
```

Include the token in all authenticated requests using the `Authorization` header:

```
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

### Scopes

The following OAuth scopes control access to API operations:

| Scope | Description | Required For |
|-------|-------------|--------------|
| `data:read` | Read access to translation data and settings | `POST /machine-translate`, `GET /languages` |
| `data:write` | Modify translation settings and preferences | Administrative operations |
| `data:create` | Create new translation requests and configurations | Submitting translation requests |

---

## POST /machine-translate

Retrieves machine translations for provided text content. This operation supports translating multiple text items in a single request.

```
POST https://developer.api.autodesk.com/languagetranslation/v1/machine-translate
```

### Important Limitations

- Each request can contain **1–20 text items** for translation.
- Source language must be either `en-US` or `en-GB`.
- When source is `en-GB`, the target must be `en-US`.

For supported target languages and language codes, use the [GET /languages](#get-languages) endpoint.

### Authentication

| Scheme | Required Scopes |
|--------|-----------------|
| OAuth 2.0 (2-legged) | `data:read` |

### Request Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `Content-Type` | `string` | Yes | Must be set to `application/json`. |
| `Authorization` | `string` | Yes | Bearer token obtained via OAuth 2.0. |

### Request Body

Content type: `application/json`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sourceLanguageCode` | `string` | No | The language code of the source text. Allowed values: `en-US`, `en-GB`. |
| `targetLanguageCode` | `string` | Yes | The desired target language for translation output. See [supported values](#supported-target-language-codes) below. |
| `origin` | `string` | No | Identifies the source system or application making the request. Used for tracking and optimization. Examples: `Passolo`, `Phrase`. |
| `textToTranslate` | `object[]` | Yes | Array of text items to translate. Minimum 1, maximum 20 items. Each item must be unique. |
| `textToTranslate[].source` | `string` | Yes | The original text to be translated into the target language. |

#### Supported Target Language Codes

| Code | Language |
|------|----------|
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |
| `cs-CZ` | Czech |
| `da-DK` | Danish |
| `nl-NL` | Dutch |
| `en-GB` | English (UK) |
| `fr-FR` | French |
| `de-DE` | German |
| `hu-HU` | Hungarian |
| `it-IT` | Italian |
| `ja-JP` | Japanese |
| `ko-KR` | Korean |
| `pl-PL` | Polish |
| `pt-BR` | Portuguese (Brazil) |
| `ru-RU` | Russian |
| `es-ES` | Spanish |
| `sv-SE` | Swedish |

### Request Example

```bash
curl -X POST \
  https://developer.api.autodesk.com/languagetranslation/v1/machine-translate \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceLanguageCode": "en-US",
    "targetLanguageCode": "de-DE",
    "origin": "Passolo",
    "textToTranslate": [
      { "source": "Hello" },
      { "source": "I like Revit" }
    ]
  }'
```

### Response — 200 OK

A successful response contains the translated text for each source item, along with processing metadata.

| Property | Type | Description |
|----------|------|-------------|
| `translations` | `object[]` | Array of translation results. Each item corresponds to an input text item from the request. |
| `translations[].translatedText` | `string` | The translated text in the target language. Maintains any formatting present in the source text. |
| `duration` | `number` | Processing time in seconds for the translation request. |
| `route` | `object` | Information about the translation route and provider used. |
| `route.name` | `string` | Name of the translation model or route. Example: `"Production general model for ja"`. |
| `route.source` | `string` | Regex pattern matching supported source language codes. Example: `"^(en|en-us)$"`. |
| `route.target` | `string` | Regex pattern matching supported target language codes. Example: `"^(ja|ja-jp)$"`. |
| `route.provider` | `object` | Translation service provider information. |
| `route.provider.name` | `string` | Provider name, e.g., `"microsoft"`. |
| `route.provider.option` | `object` | Provider-specific configuration options. |
| `route.provider.option.category` | `string` | Category identifier for the translation model. Example: `"9489b789-xxxx-4d53-xxxx-3dae52ab73c7-TECH"`. |
| `route.provider.option.description` | `string` | Human-readable description of the translation model. |

#### Response Example

```json
{
  "translations": [
    { "translatedText": "Hallo" },
    { "translatedText": "Ich mag Revit" }
  ],
  "duration": 0.211,
  "route": {
    "name": "Production general model for de",
    "source": "^(en|en-us)$",
    "target": "^(de|de-de)$",
    "provider": {
      "name": "microsoft",
      "option": {
        "category": "9489b789-xxxx-4d53-xxxx-3dae52ab73c7-TECH",
        "description": "Production general model for de"
      }
    }
  }
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| `400` | The request could not be processed due to invalid parameters or missing required fields. |
| `401` | Authentication failed. Verify that your access token is valid and not expired. |
| `404` | The requested translation service or language pair is not available. |
| `422` | The request was well-formed but contains invalid parameters or unsupported language combinations. |
| `500` | An unexpected error occurred while processing the translation request. |

Error response body:

```json
{
  "title": "Bad Request",
  "detail": "sourceLanguageCode is missing."
}
```

---

## GET /version

Retrieves the current version of the Machine Translation API. Use this endpoint to verify API compatibility and track version changes.

```
GET https://developer.api.autodesk.com/languagetranslation/v1/version
```

### Authentication

No authentication is required for this endpoint.

### Request

This endpoint has no request parameters or request body.

### Response — 200 OK

| Property | Type | Description |
|----------|------|-------------|
| `version` | `string` | The current version number of the Machine Translation API. |

#### Response Example

```json
{
  "version": "1.24"
}
```

---

## GET /languages

Retrieves a list of all languages supported by the Machine Translation API, including whether Autodesk Neural Machine Translation (NMT) is available for each language.

```
GET https://developer.api.autodesk.com/languagetranslation/v1/languages
```

### Authentication

| Scheme | Required Scopes |
|--------|-----------------|
| OAuth 2.0 (2-legged) | `data:read` |

### Request

This endpoint has no request parameters or request body.

### Response — 200 OK

Returns an array of language objects.

| Property | Type | Description |
|----------|------|-------------|
| `[].name` | `string` | Human-readable name of the language. Example: `"German"`, `"French"`, `"Japanese"`. |
| `[].code` | `string` | Standardized language code in BCP 47 format. Example: `"de-DE"`, `"fr-FR"`, `"ja-JP"`. |
| `[].AutodeskNMT` | `boolean` | `true` if Autodesk Neural Machine Translation is available for this language; `false` otherwise. |

#### Response Example

```json
[
  {
    "name": "German",
    "code": "de-DE",
    "AutodeskNMT": true
  },
  {
    "name": "French",
    "code": "fr-FR",
    "AutodeskNMT": true
  },
  {
    "name": "Hungarian",
    "code": "hu-HU",
    "AutodeskNMT": false
  },
  {
    "name": "Japanese",
    "code": "ja-JP",
    "AutodeskNMT": true
  },
  {
    "name": "Korean",
    "code": "ko-KR",
    "AutodeskNMT": true
  }
]
```

---

## Error Codes

The following table provides a consolidated reference of all HTTP error status codes returned by the Machine Translation API.

| Status Code | Title | Common Causes | Resolution |
|-------------|-------|---------------|------------|
| `400` | Bad Request | Missing required fields (`targetLanguageCode`, `textToTranslate`), malformed JSON body, invalid `Content-Type` header. | Verify the request body is valid JSON with all required fields. Ensure `Content-Type` is `application/json`. |
| `401` | Unauthorized | Missing `Authorization` header, expired access token, token does not include required scopes. | Re-request an access token with the correct scopes (`data:read`). Ensure the `Authorization: Bearer <token>` header is present. |
| `404` | Not Found | The requested translation service or language pair is not available, incorrect endpoint path. | Verify the endpoint URL and confirm the language pair is supported by calling `GET /languages`. |
| `422` | Unprocessable Entity | Unsupported source or target language code, `en-GB` source with a target other than `en-US`, exceeding the 20-item limit in `textToTranslate`. | Call `GET /languages` to verify supported language codes. Ensure `textToTranslate` contains 1–20 unique items. |
| `429` | Too Many Requests | Rate limit exceeded. | Implement exponential backoff and retry using the delay specified in the `Retry-After` response header. |
| `500` | Internal Server Error | Unexpected server-side failure during translation processing. | Retry the request after a brief delay. If the error persists, check the [APS Status Page](https://aps.autodesk.com) or contact support. |

### Error Response Schema

All error responses share the same body structure:

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | A brief, human-readable summary of the error. Examples: `"Bad Request"`, `"Unauthorized"`, `"Not Found"`. |
| `detail` | `string` | A detailed description of the error, including specific information about what went wrong and how to resolve it. |

**Example:**

```json
{
  "title": "Unprocessable Entity",
  "detail": "targetLanguageCode 'xx-XX' is not supported."
}
```

---

## Troubleshooting

### Diagnostic Checklist

Before opening a support ticket, work through the following checklist:

- [ ] **Token validity**: Confirm your access token is not expired. Tokens have a limited lifetime (typically 1 hour).
- [ ] **Required scopes**: Verify your token includes the `data:read` scope (and `data:create` if applicable). You can decode a JWT token to inspect its scopes.
- [ ] **JSON format**: Ensure your request body is valid JSON. Common mistakes include trailing commas, unquoted keys, or missing closing braces.
- [ ] **Language codes**: Confirm both `sourceLanguageCode` and `targetLanguageCode` are valid BCP 47 codes supported by the API. Call `GET /languages` to retrieve the current list.
- [ ] **Source language restriction**: The source language must be `en-US` or `en-GB`. When the source is `en-GB`, the only valid target is `en-US`.
- [ ] **Batch size**: The `textToTranslate` array must contain between 1 and 20 items. Each item must be unique.
- [ ] **Rate limits**: If receiving `429` responses, implement exponential backoff. Respect the `Retry-After` header value.
- [ ] **Content-Type header**: The `Content-Type` header must be set to `application/json` for all `POST` requests.

### Common Issues and Fixes

**"sourceLanguageCode is missing" (400)**
The `sourceLanguageCode` field was omitted from the request body. While this field is technically optional, omitting it may cause errors depending on the target language. Include `en-US` or `en-GB` as the source language code.

**"Unauthorized" (401)**
Your access token is missing, expired, or does not include the required scopes. Re-request a token and confirm you are requesting `data:read` and `data:create` scopes. Check that the token is passed in the `Authorization: Bearer <token>` header.

**"targetLanguageCode 'xx-XX' is not supported" (422)**
The target language code you specified is not recognized. Call `GET /languages` to retrieve the current list of supported BCP-47 language codes and confirm your value matches exactly (codes are case-sensitive).

**"Too Many Requests" (429)**
You have exceeded the rate limit. Implement exponential backoff and retry using the delay specified in the `Retry-After` response header.

**"Internal Server Error" (500)**
An unexpected error occurred on the server side. Retry the request after a brief delay. If the error persists, check the [APS Status Page](https://aps.autodesk.com) or contact support.

### Getting Help

- **APS Developer Forums**: Post questions and browse community answers at the [APS developer forums](https://aps.autodesk.com).
- **Autodesk Platform Services Support**: For urgent issues or production outages, contact Autodesk Platform Services support directly through the APS portal.
- **API Status**: Check the [APS Status Page](https://aps.autodesk.com) for known service disruptions.
