/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Design Automation API',
      collapsed: false,
      items: [
        'design-docs/intro',
        {
          type: 'category',
          label: 'Getting Started',
          collapsed: false,
          items: ['design-docs/getting-started/quickstart'],
        },
        {
          type: 'category',
          label: 'Guides',
          collapsed: false,
          items: ['design-docs/guides/oauth-auth-code'],
        },
        {
          type: 'category',
          label: 'Reference',
          collapsed: false,
          items: ['design-docs/reference/auth'],
        },
        {
          type: 'category',
          label: 'Concepts',
          collapsed: false,
          items: ['design-docs/concepts/security'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Viewer API',
      collapsed: true,
      items: ['viewer-api/intro'],
    },
    {
      type: 'category',
      label: 'Webhooks',
      collapsed: true,
      items: ['webhooks/intro'],
    },
    {
      type: 'category',
      label: 'Metrics & Analytics',
      collapsed: true,
      items: ['metrics/intro'],
    },
    {
      type: 'category',
      label: 'MT-API',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'mt-api/v1/reference/http/mt-api/index',
      },
      items: [
        'mt-api/v1/reference/http/mt-api/post-machine-translate',
        'mt-api/v1/reference/http/mt-api/get-version',
        'mt-api/v1/reference/http/mt-api/get-languages',
      ],
    },
  ],
};

module.exports = sidebars;
