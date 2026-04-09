Convert an OpenAPI YAML or JSON spec into Docusaurus-ready per-endpoint Markdown documentation.

User arguments: $ARGUMENTS

---

## Parse arguments

Split `$ARGUMENTS` on whitespace:
- **Arg 1** (required): absolute or relative path to the OpenAPI `.yaml` or `.json` file.
- **Arg 2** (optional): output root directory. Default: `docs/<api-slug>/` next to the spec file where `<api-slug>` is the API title lowercased and hyphenated.

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

Group operations by their **first tag**. The output directory tree is:

```
<output-root>/
  index.md                          ← API overview + endpoint table
  <tag-slug>/
    index.md                        ← Tag overview
    <method>-<path-slug>.md         ← One file per operation
    _category_.json
  _category_.json
```

Where:
- `<tag-slug>` = tag name lowercased, spaces → hyphens (e.g., `translation`, `version`)
- `<path-slug>` = path with leading `/` removed and `/` → `-` (e.g., `machine-translate`)
- Operations without a tag go into an `other/` group

---

## Step 3 — Write the files

### `_category_.json` (one per directory)

```json
{
  "label": "<Human-readable label>",
  "position": <numeric position>,
  "link": {
    "type": "doc",
    "id": "<relative doc id of the index.md in this directory>"
  }
}
```

### `<output-root>/index.md`

```markdown
---
id: <api-slug>-index
title: <info.title> Reference
description: <info.description — first sentence>
sidebar_label: Overview
sidebar_position: 1
---

# <info.title>

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

### `<output-root>/<tag-slug>/index.md`

```markdown
---
id: <api-slug>-<tag-slug>-index
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

### `<output-root>/<tag-slug>/<method>-<path-slug>.md`

Use this exact structure. Omit any section that has no content — do not output empty tables or headings.

```markdown
---
id: <api-slug>-<method>-<path-slug>
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
| `<name>` | `<type>` | Yes / No | <description> |

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
| ... | ... |

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

**Example**

```json
<first 4xx example value>
```
```

---

## Step 4 — Update `sidebars.js`

After writing all doc files, read the project's `sidebars.js` (search for it in the project root or `docs/` parent directory).

Add a new top-level category entry for this API to the `docsSidebar` array:

```js
{
  type: 'category',
  label: '<info.title>',
  collapsed: true,
  link: {
    type: 'doc',
    id: '<relative-id-of-output-root-index>',
  },
  items: [
    {
      type: 'category',
      label: '<Tag name>',
      collapsed: false,
      link: { type: 'doc', id: '<tag-index-id>' },
      items: [
        '<id-of-operation-1>',
        '<id-of-operation-2>',
      ],
    },
    // ... one category per tag
  ],
},
```

Write the updated `sidebars.js` back to disk.

---

## Rules

- **Never output `$ref` strings** — always resolve inline before writing.
- **Enum values** — list all allowed values as inline code in the description cell: `"en-US"`, `"en-GB"`.
- **Required vs optional** — derive from the schema's `required` array; never guess.
- **Descriptions are verbatim** — do not paraphrase, summarize, or rewrite spec descriptions.
- **Links between docs** — use relative paths WITHOUT `.md` extension, e.g. `./get-languages` not `./get-languages.md`.
- **doc IDs** — always set an explicit `id` in frontmatter so Docusaurus uses stable IDs regardless of file path.
- **Omit empty sections** — if a section has no data, remove the heading entirely.
- **Minimal examples** — if no example is in the spec, construct one using each required field with its `example` value or a plausible value of its `type`.
- **`index.md` in a folder** — this becomes the category landing page; reference it in the `_category_.json`.
- **Confirm on completion** — after writing all files, print a summary: files written, sidebars.js updated, any warnings (unresolvable $refs, missing examples, etc.).
