// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Design Docs POC',
  tagline: 'APS-style documentation system',
  url: 'https://ambernegi.github.io',
  baseUrl: '/Design/',
  favicon: 'img/favicon.ico',
  organizationName: 'ambernegi', // GitHub org/user name.
  projectName: 'Design', // GitHub repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: '/', // Serve docs at site root.
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
};

module.exports = config;


