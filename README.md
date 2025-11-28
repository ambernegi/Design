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

## 4. Docusaurus layer and navigation

This repo is now a **Docusaurus docs site** configured to use `docs/` as the content root and an APS-style sidebar.

- **Key files**
  - `docusaurus.config.js` – Main Docusaurus configuration.
  - `sidebars.js` – Sidebar definition that mirrors the IA above.
  - `src/css/custom.css` – Light visual customization for a doc-centric layout.
  - `package.json` – NPM scripts and Docusaurus dependencies.

The `docs` plugin is configured with:

- `path: 'docs'` – Use the `docs/` folder in this repo.
- `routeBasePath: '/'` – Serve docs at the site root (`/`), so the overview page becomes your home.

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

---

## 7. Building and deploying on GitHub Pages

You can host this site on **GitHub Pages** using the built-in Docusaurus deploy flow.

- **Before you build**
  - Edit `docusaurus.config.js` and replace:
    - `url: 'https://<your-github-username>.github.io'`
    - `baseUrl: '/<your-repo-name>/'`
    - `organizationName: '<your-github-username>'`
    - `projectName: '<your-repo-name>'`

- **Install dependencies**

```bash
npm install
```

- **Run the site locally**

```bash
npm start
```

- **Build the static site**

```bash
npm run build
```

- **Deploy to GitHub Pages**

```bash
npm run deploy
```

By default, this will push the built site to the `gh-pages` branch (as configured in `docusaurus.config.js`), which you can then expose via GitHub Pages in the repo settings.

