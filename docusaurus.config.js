// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Autodesk',
  tagline: 'Documentation System POC',
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

  themeConfig: {
    navbar: {
      title: 'Autodesk',
      logo: {
        alt: 'Autodesk',
        src: 'img/autodesk-logo.svg',
      },
      items: [],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs', // Serve docs under /docs, leave / for custom landing page.
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


