Keep the landing-page API card catalog and sidebar in sync with the `docs/` folder structure.

Run this skill whenever a new top-level folder is added under `docs/` — it will:
1. Create stub docs for the three standard sections (Developer's Guide, How-to Guide, Reference)
2. Add a card to `src/pages/index.tsx`
3. Add a per-API sidebar entry to `sidebars.js`

---

## Documentation structure

Every API folder follows this three-section layout:

```
docs/<api-slug>/
  developer-guide/
    overview.md          ← Entry point; card href points here
    troubleshooting.md
    faq.md
  how-to-guide/
    getting-started.md
  reference/             ← Populated by /openapi-to-docs skill
    index.md             ← Reference overview + endpoint table
    <tag-slug>/
      index.md
      <method>-<path-slug>.md
```

**Section purposes:**
| Section | Contents |
|---------|---------|
| Developer's Guide | Overview, troubleshooting, FAQ, conceptual topics |
| How-to Guide | Getting started, task-oriented walkthroughs |
| Reference | Endpoint-level docs generated from the OpenAPI spec |

---

## Step 1 — Discover all API folders

List every direct subdirectory of `docs/`. Each subdirectory is one API product.

For each folder, read the "root doc" in this priority order:
1. `docs/<folder>/developer-guide/overview.md`
2. `docs/<folder>/intro.md`
3. `docs/<folder>/index.md`
4. First `.md` file found recursively

Extract from YAML frontmatter: `title`, `description`, `pricing`, `industries`, `capabilities`, `beta`.
If a field is missing, infer from the document body (first heading = name, first paragraph = description).

Build an **API model**:
```
{
  folderId:     string   // folder name, e.g. "mt-api"
  name:         string   // human label, e.g. "Machine Translation API"
  description:  string   // one sentence
  pricing:      'free' | 'monetized'   // default: 'free'
  isBeta:       boolean  // default: false
  industries:   string[] // default: ['Cross-Industry']
  capabilities: string[] // infer from folder name — see table below
}
```

**Capability inference:**
| Folder contains | Capability |
|-----------------|------------|
| `design` / `automation` | `Automation` |
| `viewer` / `render` / `3d` | `3D Visualization` |
| `webhook` / `event` | `Automation` |
| `metric` / `analytic` / `telemetry` | `Data Management` |
| `translate` / `convert` / `doc` | `Document Management` |
| `data` / `storage` | `Data Management` |
| anything else | `Document Management` |

---

## Step 2 — Diff against current catalog

Read `src/pages/index.tsx`. Collect existing card `id` values from the `APIS` array.

Match folders to cards: check whether any existing `id` contains the folder name as a substring, or vice versa. Example: folder `viewer-api` matches card `id: 'viewer'`.

- **Already synced** → no action
- **New** → proceed with Steps 3–6

---

## Step 3 — Create stub docs (if the folder is new or missing sections)

For each new API folder, check whether the three sections already exist. Create only what is missing.

### `docs/<api-slug>/developer-guide/overview.md`

```markdown
---
title: Overview
description: Introduction to <API name> — what it does, when to use it, and how it fits into your workflow.
sidebar_position: 1
---

# Overview

<2–3 sentence introduction based on the API name and any available description.>

## When to use this API

- <use case 1>
- <use case 2>
- <use case 3>

## Before you begin

1. Register your app at the [APS Portal](https://aps.autodesk.com).
2. Obtain an access token using the appropriate OAuth 2.0 flow.
```

### `docs/<api-slug>/developer-guide/troubleshooting.md`

```markdown
---
title: Troubleshooting
description: Common errors and how to resolve them when using <API name>.
sidebar_position: 2
---

# Troubleshooting

## Common errors

### 401 Unauthorized

Your access token is missing, expired, or missing required scopes.

**Fix:** Re-request a token with the correct scopes.

### 400 Bad Request

A required request field is missing or malformed.

**Fix:** Review the Reference section for required fields and correct types.

## Getting help

Open an issue at the [APS developer forums](https://aps.autodesk.com) or contact support.
```

### `docs/<api-slug>/developer-guide/faq.md`

```markdown
---
title: FAQ
description: Frequently asked questions about <API name>.
sidebar_position: 3
---

# FAQ

## How do I get API credentials?

Register at the [APS Portal](https://aps.autodesk.com), create an application, and copy your Client ID and Client Secret.

## Where can I find the full API reference?

See the [Reference](../reference/index) section for endpoint-level documentation.
```

### `docs/<api-slug>/how-to-guide/getting-started.md`

```markdown
---
title: Getting Started
description: Make your first successful API call in minutes.
sidebar_position: 1
---

# Getting Started

## Prerequisites

- An APS application registered at the [APS Portal](https://aps.autodesk.com)
- A valid access token with the required scopes

## Next steps

Once credentials are in place, see the [Reference](../reference/index) section for available endpoints.
```

---

## Step 4 — Patch `src/pages/index.tsx`

Read the full current file. Preserve all existing cards exactly.

### 4a — Add missing icon declarations

Insert any new `const <Name>Icon = () => (...)` blocks before the `const APIS: Api[] = [` line. Use only icons from this approved set:

```tsx
const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ViewerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L17 7v6l-7 4L3 13V7l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 3v10M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const WebhookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2a5 5 0 00-4.9 6H3a2 2 0 000 4h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 8l2.5 4H10a2 2 0 000 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 8a5 5 0 00-1-5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const MetricsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14l4-5 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ApiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 6l-4 4 4 4M13 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 4l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
```

Icon selection: `design`/`automation` → GearIcon · `viewer`/`3d` → ViewerIcon · `webhook`/`event` → WebhookIcon · `metric`/`analytic` → MetricsIcon · `translate`/`doc`/`file` → DocIcon · else → ApiIcon.

### 4b — Append to APIS array

```tsx
  {
    id: '<folderId>',
    name: '<name>',
    description: '<one sentence, no trailing period>',
    pricing: '<free | monetized>',
    href: 'docs/<folderId>/developer-guide/overview',
    icon: <<IconName> />,
    industries: ['Cross-Industry'],
    capabilities: ['<inferred capability>'],
  },
```

Set `href` only if `developer-guide/overview.md` has real content (not just a stub). If it is a stub, omit `href` with comment `// href intentionally omitted — docs not yet available`.

Set `isBeta: true` only if the frontmatter or body explicitly says "beta" or "preview".

---

## Step 5 — Patch `sidebars.js`

Read the current `sidebars.js`. For each new API, add a new named sidebar (not appended to an existing sidebar).

```js
// ── <API Name> ───────────────────────────────────────────────────────────────
<camelCaseFolderId>Sidebar: [
  { type: 'doc', id: '<folderId>/developer-guide/overview', label: 'Overview' },
  {
    type: 'category',
    label: "Developer's Guide",
    collapsed: false,
    items: [
      '<folderId>/developer-guide/troubleshooting',
      '<folderId>/developer-guide/faq',
    ],
  },
  {
    type: 'category',
    label: 'How-to Guide',
    collapsed: false,
    items: ['<folderId>/how-to-guide/getting-started'],
  },
  {
    type: 'category',
    label: 'Reference',
    collapsed: false,
    // Populate once /openapi-to-docs is run for this API
    items: [],
  },
],
```

If a `reference/index.md` already exists, wire up the Reference category with its docs instead of leaving `items: []`.

---

## Step 6 — Validate

Run `npm run build`. Fix any broken links before finishing. Do NOT change `onBrokenLinks` from `'throw'`.

---

## Step 7 — Report

```
Sync complete.

New APIs scaffolded: <N>
  - <folderId>  →  "<Card Name>"
    Files created: developer-guide/overview.md, troubleshooting.md, faq.md, how-to-guide/getting-started.md
    Card href: docs/<folderId>/developer-guide/overview
    Sidebar: <camelCaseFolderId>Sidebar added

Already in sync: <M>
  - <folderId>  →  matched card id "<id>"

Build: PASSED / FAILED
```
