// Example Docusaurus sidebar configuration matching the APS-inspired IA.
// This can be copied into sidebars.ts / sidebars.mts and adjusted as needed.

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


