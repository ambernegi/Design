Validate the information architecture and Docusaurus pipeline readiness of this documentation project.

Runs a two-phase check:
1. **IA audit** — verifies every API folder follows the three-section structure
2. **Pipeline readiness** — verifies the Docusaurus build, sidebars, and card catalog are in sync

No arguments required. Run from the project root.

---

## Phase 1 — Information Architecture Audit

### 1a — Discover API folders

List every direct subdirectory of `docs/`. Each is one API product.

### 1b — Check three-section structure

For each API folder, verify all of the following exist:

| Required path | Purpose |
|---------------|---------|
| `docs/<api>/developer-guide/overview.md` | Entry point; must have a `title` and `description` in frontmatter |
| `docs/<api>/developer-guide/troubleshooting.md` | Troubleshooting content |
| `docs/<api>/developer-guide/faq.md` | FAQ content |
| `docs/<api>/how-to-guide/getting-started.md` | Getting started guide |

Flag any missing files as **IA violations**.

### 1c — Check frontmatter completeness

For every `.md` file found under `docs/`, verify:
- `title` field is present and non-empty
- `description` field is present and non-empty
- `sidebar_position` is present (numeric)
- No `slug: /` override (this causes global broken links — flag as critical)
- No `.md` extensions in internal links (Docusaurus requires extension-free links — flag as warning)

### 1d — Check for stub-only content

For each doc, count lines of real body content (excluding frontmatter, empty lines, and headings that are just section labels like "## Overview"). Flag files with fewer than 3 lines of real content as **stubs** — these are fine to ship but should be noted.

---

## Phase 2 — Pipeline Readiness

### 2a — Card catalog sync check

Read `src/pages/index.tsx`. Extract the `APIS` array entries (their `id` fields).

For each API folder in `docs/`:
- Check whether a matching card exists in the `APIS` array
- If a card exists, check whether `href` is set and points to a real file on disk
- If `href` is missing, flag as **no link** (card is disabled — intentional stub)
- If `href` points to a path that doesn't map to a real file, flag as **broken href**

### 2b — Sidebar sync check

Read `sidebars.js`. For each API folder, verify:
- A corresponding named sidebar exists (key named `<camelCase>Sidebar` or similar)
- Every doc ID referenced in the sidebar maps to an actual `.md` file under `docs/`
- The three sections (Developer's Guide, How-to Guide, Reference) are present as sidebar categories (warn if Reference is empty — expected until `/openapi-to-docs` is run)
- No doc IDs in the sidebar reference deleted or moved files

### 2c — Docusaurus build check

Run `npm run validate` (which runs `tsc --noEmit && docusaurus build`).

Capture the output:
- **TypeScript errors**: list each `error TS` line
- **Broken links**: list each `Broken link on source page path` block
- **Build result**: PASSED or FAILED

### 2d — Config consistency check

Read `docusaurus.config.js`. Verify:
- `onBrokenLinks` is set to `'throw'` (not `'warn'` or `'ignore'`)
- `url` and `baseUrl` are set and non-empty
- `sidebarPath` in the docs preset resolves to the existing `sidebars.js` file
- Navbar `to` / `href` values that point into `/docs/...` paths actually exist as files

---

## Output format

Print a structured report. Use these severity levels:

- **CRITICAL** — will break the build or cause broken links in production
- **WARNING** — degrades UX but won't fail the build
- **INFO** — informational, no action required

```
═══════════════════════════════════════════════════
  IA + Pipeline Validation Report
  Project: <title from docusaurus.config.js>
  Date: <today>
═══════════════════════════════════════════════════

── Phase 1: Information Architecture ───────────────

APIs found: <N>
  <api-1>, <api-2>, ...

Three-section structure:
  ✓ design-docs     developer-guide ✓  how-to-guide ✓  reference ✓
  ✓ mt-api          developer-guide ✓  how-to-guide ✓  reference ✓
  ✗ <api>           developer-guide ✗  MISSING: overview.md, troubleshooting.md
  ...

Frontmatter issues:
  CRITICAL  docs/design-docs/intro.md — slug: / overrides root path (breaks all internal links)
  WARNING   docs/viewer-api/developer-guide/faq.md — missing description field
  WARNING   docs/mt-api/developer-guide/faq.md — link ./get-version.md has .md extension

Stub files (< 3 lines of real content):
  INFO  docs/viewer-api/developer-guide/troubleshooting.md
  INFO  docs/webhooks/developer-guide/faq.md
  ...

── Phase 2: Pipeline Readiness ─────────────────────

Card catalog sync:
  ✓ design-docs    card id=design-docs   href → docs/design-docs/developer-guide/overview ✓
  ✓ mt-api         card id=mt-api        href → docs/mt-api/developer-guide/overview ✓
  ✗ viewer-api     card id=viewer        href not set (disabled card — expected stub)
  ...

Sidebar sync:
  ✓ designAutomationSidebar  — 3 sections, 5 doc IDs, all resolve
  ✓ mtApiSidebar             — 3 sections, 7 doc IDs, all resolve
  WARNING viewerSidebar      — Reference section is empty (run /openapi-to-docs to populate)
  ...

Docusaurus build:
  TypeScript: PASSED (0 errors)
  Broken links: PASSED (0 broken)
  Build: PASSED ✓

Config:
  ✓ onBrokenLinks = 'throw'
  ✓ url and baseUrl set
  ✓ sidebarPath resolves
  WARNING  navbar link /docs/design-docs/concepts/security — file not found
  ...

── Summary ─────────────────────────────────────────

  CRITICAL  <N>  (must fix before merge)
  WARNING   <N>  (should fix)
  INFO      <N>  (optional)

  Overall: READY TO DEPLOY / NEEDS FIXES
═══════════════════════════════════════════════════
```

If there are CRITICAL issues, exit with a non-zero status indication and do NOT proceed with any auto-fixes — report only.

If there are only WARNINGs or INFOs, offer to fix them automatically by asking the user which ones to address.
