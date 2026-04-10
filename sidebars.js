/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  // ── Design Automation API ────────────────────────────────────────────────
  designAutomationSidebar: [
    { type: 'doc', id: 'design-docs/developer-guide/overview', label: 'Overview' },
    {
      type: 'category',
      label: "Developer's Guide",
      collapsed: false,
      items: [
        'design-docs/developer-guide/security',
        'design-docs/developer-guide/troubleshooting',
        'design-docs/developer-guide/faq',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guide',
      collapsed: false,
      items: [
        'design-docs/how-to-guide/getting-started',
        'design-docs/how-to-guide/oauth-auth-code',
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
    { type: 'doc', id: 'viewer-api/developer-guide/overview', label: 'Overview' },
    {
      type: 'category',
      label: "Developer's Guide",
      collapsed: false,
      items: [
        'viewer-api/developer-guide/troubleshooting',
        'viewer-api/developer-guide/faq',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guide',
      collapsed: false,
      items: ['viewer-api/how-to-guide/getting-started'],
    },
  ],

  // ── Webhooks ─────────────────────────────────────────────────────────────
  webhooksSidebar: [
    { type: 'doc', id: 'webhooks/developer-guide/overview', label: 'Overview' },
    {
      type: 'category',
      label: "Developer's Guide",
      collapsed: false,
      items: [
        'webhooks/developer-guide/troubleshooting',
        'webhooks/developer-guide/faq',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guide',
      collapsed: false,
      items: ['webhooks/how-to-guide/getting-started'],
    },
  ],

  // ── Metrics & Analytics ──────────────────────────────────────────────────
  metricsSidebar: [
    { type: 'doc', id: 'metrics/developer-guide/overview', label: 'Overview' },
    {
      type: 'category',
      label: "Developer's Guide",
      collapsed: false,
      items: [
        'metrics/developer-guide/troubleshooting',
        'metrics/developer-guide/faq',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guide',
      collapsed: false,
      items: ['metrics/how-to-guide/getting-started'],
    },
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
        'mt-api/v1/reference/api-reference',
        'mt-api/v1/reference/http/mt-api/post-machine-translate',
        'mt-api/v1/reference/http/mt-api/get-version',
        'mt-api/v1/reference/http/mt-api/get-languages',
      ],
    },
    { type: 'doc', id: 'mt-api/changelog', label: 'Changelog' },
  ],

};

module.exports = sidebars;
