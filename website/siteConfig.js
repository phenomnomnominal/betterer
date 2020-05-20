module.exports = {
  title: 'Betterer',
  tagline: '',

  url: 'https://phenomnomnominal.github.io',
  baseUrl: '/betterer/',
  projectName: 'betterer',
  organizationName: 'phenomnomnominal',

  headerLinks: [
    { doc: 'getting-started', label: 'Docs' },
    { doc: 'api', label: 'API' },
    { page: 'help', label: 'Help' },
    { blog: true, label: 'Blog' }
  ],

  users: [],

  /* path to images for header/footer */
  headerIcon: 'img/favicon.png',
  footerIcon: 'img/favicon.png',
  favicon: 'img/favicon.png',

  colors: {
    primaryColor: '#ffff00',
    secondaryColor: '#000000'
  },

  fonts: {
    mono: ['Roboto Mono', 'monospace'],
    display: ['Pacifico', 'cursive'],
    content: ['Roboto Slab', 'serif']
  },

  copyright: `Copyright © ${new Date().getFullYear()} Craig Spence`,

  highlight: {
    theme: 'default', // overridden in static/css/custom.css
    defaultLang: 'typescript'
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],
  stylesheets: ['https://fonts.googleapis.com/css?family=Pacifico|Roboto+Mono|Roboto+Slab&display=swap'],

  onPageNav: 'separate',

  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  enableUpdateBy: true,
  enableUpdateTime: true,

  repoUrl: 'https://github.com/phenomnomnominal/betterer',
  twitter: 'phenomnominal',
  discord: 'PeT7Nz'
};
