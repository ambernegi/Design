/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  // ── Design Automation API ────────────────────────────────────────────────
  designAutomationSidebar: [
    { type: 'doc', id: 'design-docs/intro', label: 'Overview' },
    {
      type: 'category',
      label: "Developer's Guide",
      collapsed: false,
      items: [
        'design-docs/concepts/security',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guide',
      collapsed: false,
      items: [
        'design-docs/getting-started/quickstart',
        'design-docs/guides/oauth-auth-code',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'design-docs/reference/auth',
      ],
    },
  ],

  // ── Viewer API ───────────────────────────────────────────────────────────
  viewerSidebar: [
    { type: 'doc', id: 'viewer-api/intro', label: 'Overview' },
  ],

  // ── Webhooks ─────────────────────────────────────────────────────────────
  webhooksSidebar: [
    { type: 'doc', id: 'webhooks/intro', label: 'Overview' },
  ],

  // ── Metrics & Analytics ──────────────────────────────────────────────────
  metricsSidebar: [
    { type: 'doc', id: 'metrics/intro', label: 'Overview' },
  ],

  // ── Machine Translation API ──────────────────────────────────────────────
  mtApiSidebar: [
    { type: 'doc', id: 'mt-api/developer-guide/overview', label: 'Overview' },
    {
      type: 'category',
      label: "Developer's Guide",
      collapsed: false,
      items: [
        'mt-api/developer-guide/troubleshooting',
        'mt-api/developer-guide/faq',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guide',
      collapsed: false,
      items: [
        'mt-api/how-to-guide/getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      link: { type: 'doc', id: 'mt-api/v1/reference/http/mt-api/index' },
      items: [
        'mt-api/v1/reference/http/mt-api/post-machine-translate',
        'mt-api/v1/reference/http/mt-api/get-version',
        'mt-api/v1/reference/http/mt-api/get-languages',
      ],
    },
  ],

};

module.exports = sidebars;
