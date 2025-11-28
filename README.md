## Documentation Content Design (POC)

This POC defines a **scalable, system-friendly documentation content model** inspired by the layout and clarity of the Autodesk APS OAuth docs, especially the [OAuth overview](https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/overview/).

The goal is to keep **content in portable Markdown**, with a structure that works well in systems like Docusaurus, MkDocs, and others, while giving you an APS-style experience: left nav, central content, and right-hand in-page TOC.

---

## 1. Information architecture

- **Top-level sections**
  - **Overview** – High-level product understanding and positioning.
  - **Getting Started** – Quickstart and first-success path.
  - **Guides** – Task / workflow-based guides (e.g., OAuth flows).
  - **Reference** – Precise endpoint and schema documentation.
  - **Concepts** – Deeper explanations (security, tokens, rate limits, etc.).

- **Folder and URL model**
  - `docs/overview/intro.md`
  - `docs/getting-started/quickstart.md`
  - `docs/guides/oauth-auth-code.md`
  - `docs/reference/api/auth.md`
  - `docs/concepts/security.md`

This aligns with the APS OAuth docs hierarchy while remaining small and extensible.

---

## 2. Page layout and UX model

Each page assumes a **3-pane UI** similar to the APS docs:

- **Left nav**: Section groups and pages (driven by the folder structure).
- **Center content**: Title, summary, prerequisites, workflow, examples.
- **Right TOC**: Auto-generated from `##` / `###` headings.

Reusable content elements:

- **Frontmatter metadata** (title, description, tags, status, version).
- **Standard section order**:
  - Purpose
  - When to use this
  - Prerequisites (if applicable)
  - Key concepts
  - Workflow / steps
  - Examples
  - Related topics
- **Callouts** implemented via Markdown blockquotes (e.g., notes, warnings).

---

## 3. Content template (per-page model)

Pages use a minimal, doc-system-friendly frontmatter schema:

```markdown
---
title: OAuth Overview
description: High-level overview of the OAuth flows supported by the API.
tags:
  - authentication
  - oauth
  - security
category: Guides
status: draft        # draft | beta | stable
version: v1
last_updated: 2025-11-28
---
```

Followed by a consistent structure:

- **Purpose**
- **When to use this**
- **Prerequisites** (if needed)
- **Key concepts**
- **Workflow / Steps**
- **Examples**
- **Related topics**

This matches the clarity and scannability you see in the [Autodesk APS OAuth overview](https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/overview/), while staying portable.

---

## 4. Example Docusaurus sidebar (navigation)

The POC includes an example Docusaurus sidebar configuration in `docusaurus.sidebar.example.mts` that maps directly to the `docs/` folders:

```ts
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsible: false,
      items: [
        'overview/intro',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/oauth-auth-code',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/api/auth',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/security',
      ],
    },
  ],
};

export default sidebars;
```

To use this in a Docusaurus project:

- Copy the `docs/` directory into your Docusaurus repo.
- Copy `docusaurus.sidebar.example.mts` into your project as `sidebars.mts` (or merge it with your existing config).
- Ensure your Docusaurus config points to `docs` as the documentation directory.

Any modern doc system that supports frontmatter and sidebars (Docusaurus, MkDocs, etc.) can map a similar hierarchy.

---

## 5. Included example pages

This POC already includes the following example Markdown pages:

- `docs/overview/intro.md` – Product Overview.
- `docs/getting-started/quickstart.md` – Quickstart flow.
- `docs/guides/oauth-auth-code.md` – Implement the Authorization Code Flow.
- `docs/reference/api/auth.md` – Authentication API Reference.
- `docs/concepts/security.md` – Security and token concepts.

Each follows the standard template so they can be cloned and customized as the documentation grows.

---

## 6. How to extend this

- **Add new guides** under `docs/guides/`, one workflow per file.
- **Extend reference** under `docs/reference/` with more endpoint groups.
- **Add concepts** under `docs/concepts/` for any reusable idea that needs depth.
- Keep the **frontmatter schema** and **section order** consistent to maintain a clean, APS-inspired experience across the docs.
