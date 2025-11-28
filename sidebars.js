/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsible: false,
      items: ['overview/intro'],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/quickstart'],
    },
    {
      type: 'category',
      label: 'Guides',
      items: ['guides/oauth-auth-code'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/api/auth'],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: ['concepts/security'],
    },
  ],
};

module.exports = sidebars;


