---
title: Machine Translate
description: Retrieves machine translations for provided text content.
sidebar_position: 1
---

# Machine Translate

`POST` `https://developer.api.autodesk.com/languagetranslation/v1/machine-translate`

Retrieves machine translations for provided text content. This operation supports translating multiple text items in a single request.

Important limitations:

- Each request can contain 1-20 text items for translation
- Source language must be either en-US or en-GB
- When source is en-GB, target must be en-US and vice versa

For supported target languages and language codes, use the [List Supported Languages](./get-languages) operation.

## Authentication

| Scheme | Required Scopes |
|--------|-----------------|
| OAuth 2.0 (2-legged) | `data:read` |

## Request

### Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `Content-Type` | `string` | Yes | Specifies the media type of the request body. Must be set to `application/json` for all translation requests to ensure proper processing of the JSON payload. Default: `application/json`. |

### Request Body

Content type: `application/json`

Represents a translation request containing source text and language specifications. Each request can include multiple text items to be translated in a single operation.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sourceLanguageCode` | `string` | No | The language code of the source text to be translated. Allowed values: `en-US`, `en-GB`. |
| `targetLanguageCode` | `string` | Yes | The desired language for the translation output. Allowed values: `zh-CN`, `zh-TW`, `cs-CZ`, `da-DK`, `nl-NL`, `en-GB`, `fr-FR`, `de-DE`, `hu-HU`, `it-IT`, `ja-JP`, `ko-KR`, `pl-PL`, `pt-BR`, `ru-RU`, `es-ES`, `sv-SE`. |
| `origin` | `string` | No | Identifies the source system or application making the translation request. Helps with request tracking and optimization. Examples: `Passolo`, `Phrase`. |
| `textToTranslate` | `object[]` | Yes | Array of text items to be translated. Minimum 1, maximum 20 items. Each item must be unique. |
| `textToTranslate[].source` | `string` | Yes | The original text to be translated into the target language. |

**Example**

```json
{
  "sourceLanguageCode": "en-US",
  "targetLanguageCode": "de-DE",
  "origin": "Passolo",
  "textToTranslate": [
    { "source": "Hello" },
    { "source": "I like Revit" }
  ]
}
```

## Response

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | The text was successfully translated to the target language. |
| `400` | The request could not be processed due to invalid parameters or missing required fields. |
| `401` | Authentication failed. Verify that your access token is valid and not expired. |
| `404` | The requested translation service or language pair is not available. |
| `422` | The request was well-formed but contains invalid parameters or unsupported language combinations. |
| `500` | An unexpected error occurred while processing the translation request. |

### Response Body — 200 OK

Represents the synchronous translation response containing translated text for each source text item in the original request, along with processing metadata.

| Property | Type | Description |
|----------|------|-------------|
| `translations` | `object[]` | Array of translation results. Each item contains the translated text corresponding to an input text item from the original request. |
| `translations[].translatedText` | `string` | The translated text in the requested target language. Maintains any formatting present in the source text. |
| `duration` | `number` | The processing time in seconds for the translation request. |
| `route` | `object` | Information about the translation route and provider used for processing the request. |
| `route.name` | `string` | The name of the translation model or route used to process the request. Example: `"Production general model for ja"`. |
| `route.source` | `string` | Regular expression pattern matching the source language codes supported by this route. Example: `"^(en|en-us)$"`. |
| `route.target` | `string` | Regular expression pattern matching the target language codes supported by this route. Example: `"^(ja|ja-jp)$"`. |
| `route.provider` | `object` | Information about the translation service provider and its configuration. |
| `route.provider.name` | `string` | The name of the translation service provider, e.g. `"microsoft"`. |
| `route.provider.option` | `object` | Provider-specific configuration options and metadata for the translation model. |
| `route.provider.option.category` | `string` | The category identifier for the translation model used. Example: `"9489b789-xxxx-4d53-xxxx-3dae52ab73c7-TECH"`. |
| `route.provider.option.description` | `string` | Human-readable description of the translation model configuration. |

**Example**

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

### Error Response Body

Returned for `400`, `401`, `404`, `422`, and `500` responses.

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | A brief, human-readable summary of the error. Examples: `"Bad Request"`, `"Unauthorized"`, `"Not Found"`. |
| `detail` | `string` | A detailed description of the error, including specific information about what went wrong and how to fix it. |

**Example**

```json
{
  "title": "Bad Request",
  "detail": "sourceLanguageCode is missing."
}
```
