Convert an OpenAPI YAML or JSON spec into Docusaurus-ready Reference documentation.

The output goes into the **Reference** section of an existing API folder, or bootstraps a full new API folder with all three standard sections (Developer's Guide, How-to Guide, Reference).

User arguments: $ARGUMENTS

---

## Parse arguments

Split `$ARGUMENTS` on whitespace:
- **Arg 1** (required): absolute or relative path to the OpenAPI `.yaml` or `.json` file.
- **Arg 2** (optional): target API folder under `docs/`. Default: `docs/<api-slug>/` where `<api-slug>` is `info.title` lowercased and hyphenated.

The Reference docs always land at:
```
docs/<api-slug>/reference/
```

---

## Step 1 — Deeply analyse the spec

Read the input file with the Read tool. Build a full in-memory model:

1. **API metadata**: `info.title`, `info.version`, `info.description`, `servers[0].url`.
2. **Tags**: the top-level `tags` array — each tag groups related endpoints.
3. **Security schemes**: from `components.securitySchemes` — capture type, flow, token URL, scopes.
4. **Schemas**: recursively resolve every `$ref` in `components.schemas`.
   - Follow chains: if schema A `$ref`s schema B which `$ref`s schema C, inline C into B into A.
   - Handle `allOf`, `oneOf`, `anyOf` by merging properties.
   - Flatten nested objects into dot-notation rows: `route.provider.name`.
   - Show arrays as `{itemType}[]`, e.g. `object[]`, `string[]`.
5. **Operations**: for each `{path, method}` pair in `paths`, extract:
   - `summary`, `description`, `operationId`, `tags`, `security`
   - `parameters` (header, path, query) with schema, required, description
   - `requestBody` — content type, resolved schema, named examples
   - `responses` — all status codes, resolved schemas, named examples

---

## Step 2 — Plan the output structure

All generated files live under `docs/<api-slug>/reference/`.
Group operations by their **first tag**. The output tree is:

```
docs/<api-slug>/reference/
  index.md                          ← Reference overview + full endpoint table
  <tag-slug>/
    index.md                        ← Tag overview + tag endpoint table
    <method>-<path-slug>.md         ← One file per operation
```

Where:
- `<tag-slug>` = tag name lowercased, spaces → hyphens (e.g., `translation`, `version`)
- `<path-slug>` = path with leading `/` removed and `/` → `-` (e.g., `machine-translate`)
- Operations without a tag go into an `other/` group

---

## Step 3 — Write the Reference files

### `docs/<api-slug>/reference/index.md`

```markdown
---
title: <info.title> Reference
description: <info.description — first sentence>
sidebar_label: Reference Overview
sidebar_position: 1
---

# <info.title> Reference

**Version:** `<info.version>`
**Base URL:** `<servers[0].url>`

<info.description — full text, verbatim>

## Endpoints

| Method | Path | Summary | Tag |
|--------|------|---------|-----|
| `POST` | [`/machine-translate`](./<tag-slug>/post-machine-translate) | Machine Translate | Translation |

## Authentication

<For each security scheme, write a short paragraph explaining the scheme, flow, token URL, and scopes table.>

| Scope | Description |
|-------|-------------|
| `data:read` | ... |
```

### `docs/<api-slug>/reference/<tag-slug>/index.md`

```markdown
---
title: <Tag name>
description: <Tag description from top-level tags array>
sidebar_label: <Tag name>
sidebar_position: <tag position in tags array + 1>
---

# <Tag name>

<Tag description>

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `POST` | [`/machine-translate`](./post-machine-translate) | Machine Translate |
```

### `docs/<api-slug>/reference/<tag-slug>/<method>-<path-slug>.md`

Use this exact structure. Omit any section that has no content.

```markdown
---
title: <operation.summary>
description: <First sentence of operation.description>
sidebar_label: <operation.summary>
sidebar_position: <operation index within its tag group, 1-based>
---

# <operation.summary>

`<METHOD>` `<full-base-url><path>`

<operation.description — complete, verbatim, preserve bullet lists and paragraphs>

## Authentication

<If operation has security requirements:>
| Scheme | Required Scopes |
|--------|-----------------|
| <scheme name> | `<scope1>`, `<scope2>` |

<If no auth: "No authentication required for this endpoint.">

## Request

### Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|

### Request Body

Content type: `<mediaType>`

<one-paragraph summary of what the body represents, from the schema description>

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `<name>` | `<type>` | Yes / No | <description — verbatim from spec, including enum values formatted as inline code list> |

**Example**

```json
<paste first named example exactly; if none, construct minimal valid JSON from required fields and their types/examples>
```

## Response

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | <first sentence of the 200 description> |
| `400` | <first sentence> |

### `200` Response Body

<one-paragraph summary of what the success response represents>

| Property | Type | Description |
|----------|------|-------------|
| `<name>` | `<type>` | <description> |

**Example**

```json
<paste first named example for the 200 response exactly>
```

### Error Response Body

<Describe the shared error schema once. List all error status codes that use it.>

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | <description> |
| `detail` | `string` | <description> |
```

---

## Step 4 — Bootstrap the API folder (if new)

Check whether `docs/<api-slug>/developer-guide/overview.md` already exists.

**If it does NOT exist**, create the full three-section structure with stubs:

### `docs/<api-slug>/developer-guide/overview.md`

```markdown
---
title: Overview
description: Introduction to <info.title> — what it does, when to use it, and how it fits into your workflow.
sidebar_position: 1
---

# Overview

<Write 2–3 sentences introducing the API based on info.description.>

## When to use this API

<Write 3 bullet points based on the API's purpose.>

## Key concepts

| Concept | Description |
|---------|-------------|
| <concept> | <description> |

## Before you begin

1. Register your app at the [APS Portal](https://aps.autodesk.com).
2. Obtain an access token using the OAuth 2.0 flow appropriate for your use case.
```

### `docs/<api-slug>/developer-guide/troubleshooting.md`

```markdown
---
title: Troubleshooting
description: Common errors and how to resolve them when using <info.title>.
sidebar_position: 2
---

# Troubleshooting

<For each HTTP error code in the spec's responses, write an H3 with the code + title, a cause sentence, and a Fix line.>

## Checklist

Before opening a support ticket, verify:

- [ ] Token is valid and not expired
- [ ] Token includes the required scopes
- [ ] Request body is valid JSON
```

### `docs/<api-slug>/developer-guide/faq.md`

```markdown
---
title: FAQ
description: Frequently asked questions about <info.title>.
sidebar_position: 3
---

# FAQ

<Generate 4–6 FAQ entries based on common questions for this type of API (auth, content limits, data storage, credentials).>
```

### `docs/<api-slug>/how-to-guide/getting-started.md`

```markdown
---
title: Getting Started
description: Make your first successful API call in minutes.
sidebar_position: 1
---

# Getting Started

<Step-by-step guide: obtain token, make a first call using the simplest endpoint, handle the response. Use curl examples. Base on actual spec endpoints and schemas.>
```

---

## Step 5 — Update `sidebars.js`

Read `sidebars.js` from the project root.

**Case A — API sidebar already exists** (a key named `<api-slug>Sidebar` or similar):
- Find the `Reference` category within it.
- Replace or add the Reference category items to match the newly generated docs.

**Case B — No sidebar exists for this API yet**:
Add a new complete sidebar entry:

```js
// ── <info.title> ────────────────────────────────────────────────────────────
<apiSlug>Sidebar: [
  { type: 'doc', id: '<api-slug>/developer-guide/overview', label: 'Overview' },
  {
    type: 'category',
    label: "Developer's Guide",
    collapsed: false,
    items: [
      '<api-slug>/developer-guide/troubleshooting',
      '<api-slug>/developer-guide/faq',
    ],
  },
  {
    type: 'category',
    label: 'How-to Guide',
    collapsed: false,
    items: ['<api-slug>/how-to-guide/getting-started'],
  },
  {
    type: 'category',
    label: 'Reference',
    collapsed: false,
    link: { type: 'doc', id: '<api-slug>/reference/index' },
    items: [
      // one entry per tag group:
      {
        type: 'category',
        label: '<Tag name>',
        collapsed: false,
        link: { type: 'doc', id: '<api-slug>/reference/<tag-slug>/index' },
        items: [
          '<api-slug>/reference/<tag-slug>/<method>-<path-slug>',
          // ...
        ],
      },
    ],
  },
],
```

**`index.md` href rule**: When the root doc is named `index.md`, the doc ID ends in `/index` but the Docusaurus URL does NOT include `index` — Docusaurus strips it. Use the full ID in sidebar `id` fields, but when setting `href` in `src/pages/index.tsx`, omit the trailing `/index`.

Write the updated `sidebars.js` back to disk.

---

## Step 6 — Update `src/pages/index.tsx` (if new API)

If this is a new API (no existing card), add an entry to the `APIS` array following the pattern in the `/sync-api-cards` skill. Set:
- `href: 'docs/<api-slug>/developer-guide/overview'`

---

## Step 7 — Validate

Run `npm run build`. Fix any broken links before finishing. Do NOT change `onBrokenLinks` from `'throw'`.

---

## Rules

- **Never output `$ref` strings** — always resolve inline before writing.
- **Enum values** — list all allowed values as inline code: `"en-US"`, `"en-GB"`.
- **Required vs optional** — derive from the schema's `required` array; never guess.
- **Descriptions are verbatim** — do not paraphrase or rewrite spec descriptions.
- **Links between docs** — use relative paths WITHOUT `.md` extension.
- **Omit empty sections** — if a section has no data, remove the heading entirely.
- **Reference only** — this skill generates Reference docs. Developer's Guide and How-to Guide stubs are created once on bootstrap; their content is written by humans or the `/sync-api-cards` skill.
- **Confirm on completion** — print a summary: files written, sidebars.js updated, any warnings.
