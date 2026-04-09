Keep the landing-page API card catalog and sidebar in sync with the `docs/` folder structure.

Run this skill whenever a new top-level folder is added under `docs/` — it will create a properly structured API entry in `src/pages/index.tsx` and a matching entry in `sidebars.js`.

---

## Step 1 — Discover all API folders

List every direct subdirectory of `docs/`. Each subdirectory is one API product.

For each folder:
1. Look for a "root doc" in this priority order:
   - `docs/<folder>/intro.md`
   - `docs/<folder>/index.md`
   - The first `.md` file found by a recursive glob `docs/<folder>/**/*.md`
2. Read that file and extract from the YAML frontmatter:
   - `title` → human-readable API name
   - `description` → one-sentence summary
   - Any custom fields: `pricing`, `industries`, `capabilities`, `beta`
3. If frontmatter is missing a field, infer it from the document body (first heading = name, first paragraph = description).

Build an **API model** for each folder:
```
{
  folderId:     string   // the folder name, e.g. "design-docs"
  name:         string   // human label, e.g. "Design Automation API"
  description:  string   // one sentence
  pricing:      'free' | 'monetized'   // default: 'free' if not specified
  isBeta:       boolean  // default: false
  industries:   string[] // default: ['Cross-Industry']
  capabilities: string[] // infer from API category — see table below
  rootDocId:    string   // Docusaurus doc id, e.g. "design-docs/intro"
}
```

**Capability inference table** (use the folder name as a hint):
| Folder contains | Suggested capability |
|-----------------|----------------------|
| `design` / `automation` | `Automation` |
| `viewer` / `render` / `3d` | `3D Visualization` |
| `webhook` / `event` | `Automation` |
| `metric` / `analytic` / `telemetry` | `Data Management` |
| `translate` / `convert` | `Document Management` |
| `data` / `storage` | `Data Management` |
| anything else | `Document Management` |

---

## Step 2 — Diff against current catalog

Read `src/pages/index.tsx`. Extract the existing `APIS` array entries by scanning for `id:` fields inside the array literal.

Collect the set of existing IDs: e.g. `{ 'design-docs', 'viewer', 'webhooks', 'metrics' }`.

**Note**: the folder name and the card `id` may differ. Match by checking whether any existing card `id` contains the folder name as a substring, or whether the folder name contains an existing card `id` as a substring. Example: folder `viewer-api` matches card `id: 'viewer'`.

Report:
- **Already synced**: folders that matched an existing card (no action needed)
- **New**: folders with no matching card → will be added

If everything is already in sync, print a summary and stop.

---

## Step 3 — Generate icon TSX for each new API

Choose the most fitting SVG icon from this set. Use ONLY icons from this approved list — do not invent new SVGs:

```tsx
// Gear / automation
const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Document / file
const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 3D / viewer
const ViewerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L17 7v6l-7 4L3 13V7l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 3v10M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Webhook / event
const WebhookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2a5 5 0 00-4.9 6H3a2 2 0 000 4h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 8l2.5 4H10a2 2 0 000 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 8a5 5 0 00-1-5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Metrics / analytics
const MetricsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14l4-5 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// API / integration (default fallback)
const ApiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 6l-4 4 4 4M13 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 4l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
```

**Icon selection rules:**
- `design` / `automation` / `gear` in folder name → `GearIcon`
- `viewer` / `render` / `3d` in folder name → `ViewerIcon`
- `webhook` / `event` in folder name → `WebhookIcon`
- `metric` / `analytic` / `telemetry` in folder name → `MetricsIcon`
- `translate` / `doc` / `file` in folder name → `DocIcon`
- Anything else → `ApiIcon`

Only add a new `const <Name>Icon` declaration if that icon name does not already exist in the file.

---

## Step 4 — Patch `src/pages/index.tsx`

Read the entire current file. Apply edits carefully — preserve all existing cards exactly as-is.

### 4a — Add missing icon declarations

Insert any new `const <Name>Icon = () => (...)` blocks directly before the `const APIS: Api[] = [` line. One blank line between each declaration.

### 4b — Add new APIS entries

Append to the `APIS` array, after the last existing entry and before the closing `];`.

Use this template for each new entry:
```tsx
  {
    id: '<folderId>',
    name: '<name from frontmatter>',
    description: '<description from frontmatter — one sentence, no trailing period>',
    pricing: '<free | monetized>',
    href: 'docs/<rootDocId>',
    icon: <<IconName> />,
    industries: [<comma-separated quoted strings>],
    capabilities: [<comma-separated quoted strings>],
  },
```

Set `href` if the root doc file actually exists on disk and has substantive content (more than 5 lines of real body text beyond frontmatter/headings). If it's a stub ("coming soon", under 5 body lines), omit `href` (comment it out with `// href intentionally omitted — docs not yet available`).

**Important — `index.md` href rule**: If the root doc is an `index.md` file, the href must NOT end in `/index`. Drop the `/index` suffix so Docusaurus resolves to the correct URL. Example: root doc at `docs/mt-api/v1/reference/http/mt-api/index.md` → `href: 'docs/mt-api/v1/reference/http/mt-api'`.

Set `isBeta: true` only if the frontmatter or doc body explicitly mentions "beta" or "preview".

### 4c — Update INDUSTRIES and CAPABILITIES derived constants

These are derived automatically from the APIS array:
```tsx
const INDUSTRIES = [...new Set(APIS.flatMap((a) => a.industries))].sort();
const CAPABILITIES = [...new Set(APIS.flatMap((a) => a.capabilities))].sort();
```
Do NOT manually edit these lines — they recompute from the APIS array at runtime.

---

## Step 5 — Patch `sidebars.js`

Read the current `sidebars.js`. For each new API folder not already present as a top-level sidebar category, append an entry to the `docsSidebar` array.

Determine sidebar items by scanning `docs/<folderId>/` recursively for all `.md` files. Build an ordered list of doc IDs using `<folderId>/<relative-path-without-extension>`.

Use this structure:
```js
{
  type: 'category',
  label: '<name from frontmatter>',
  collapsed: true,
  link: { type: 'doc', id: '<rootDocId>' },
  items: [
    '<folderId>/intro',       // always first if it exists
    // ... remaining doc IDs in alphabetical order within each subdirectory
  ],
},
```

For deeply nested APIs (e.g. `mt-api/v1/reference/http/mt-api/`), use sub-categories to mirror the folder hierarchy rather than a flat list.

---

## Step 6 — Validate

Run `npm run build` from the project root. If it fails:
1. Read the error output carefully.
2. Fix broken links or missing doc IDs (do NOT change `onBrokenLinks` from `'throw'`).
3. Re-run until the build passes cleanly.

---

## Step 7 — Report

Print a concise summary:
```
Sync complete.

New cards added: <N>
  - <folderId>  →  "<Card Name>"  (href: docs/<rootDocId>)
  - ...

Already in sync: <M>
  - <folderId>  →  matched card id "<id>"

sidebars.js: <N> new categories added / already up to date

Build: PASSED / FAILED (see errors above)
```
