const BASE_THEME = require('prism-react-renderer/themes/dracula');

const THEME = {
  ...BASE_THEME,
  plain: {
    ...BASE_THEME.plain,
    backgroundColor: '#000000'
  }
};

module.exports = {
  title: 'Betterer',
  tagline: 'Improve, incrementally',

  url: 'https://phenomnomnominal.github.io',
  baseUrl: '/betterer/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  favicon: 'img/favicon.png',

  organizationName: 'phenomnomnominal',
  projectName: 'betterer',
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Lato:wght@300|Roboto+Mono',
    'https://fonts.googleapis.com/css?family=Pacifico&text=Betterer'
  ],
  themeConfig: {
    algolia: {
      apiKey: '294187e59bb9be56291c9088e9d49afe',
      indexName: 'betterer'
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true
    },
    googleAnalytics: {
      trackingID: 'UA-35865678-1',
      anonymizeIP: true
    },
    prism: {
      theme: THEME
    },
    image: 'img/betterer.png',
    sidebarCollapsible: true,
    navbar: {
      hideOnScroll: true,
      title: 'Betterer',
      logo: {
        alt: 'Betterer Logo',
        src: 'img/logo.png'
      },
      items: [
        {
          label: 'Docs',
          type: 'doc',
          docId: 'introduction',
          position: 'left'
        },
        {
          label: 'API',
          type: 'doc',
          docId: 'api/api',
          position: 'left'
        },
        {
          label: 'Blog',
          to: 'blog',
          activeBasePath: 'blog',
          position: 'left'
        },
        {
          href: 'https://github.com/phenomnomnominal/betterer',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Betterer',
              to: 'docs/introduction'
            },
            {
              label: 'Get started',
              to: 'docs/installation'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Report an issue',
              href: 'https://github.com/phenomnomnominal/betterer/issues'
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/betterer'
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/YNgtXt6QVX'
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/phenomnominal'
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'API',
              to: 'docs/api'
            },
            {
              label: 'Blog',
              to: 'blog'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/phenomnomnominal/betterer'
            },
            {
              label: 'VS Code extension',
              href: 'https://marketplace.visualstudio.com/items?itemName=Betterer.betterer-vscode'
            }
          ]
        }
      ],
      logo: {
        alt: 'Betterer Logo',
        src: 'img/logo.png'
      },
      copyright: `Copyright © ${new Date().getFullYear()} Craig Spence`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/phenomnomnominal/betterer/edit/master/website/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/phenomnomnominal/betterer/edit/master/website/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
