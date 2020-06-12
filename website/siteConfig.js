module.exports = {
  title: 'Betterer',
  tagline: 'Improve, incrementally',

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

  headerIcon: 'img/favicon.png',
  footerIcon: 'img/favicon.png',
  favicon: 'img/favicon.png',

  colors: {
    primaryColor: '#ffff00',
    secondaryColor: '#000000'
  },

  copyright: `Copyright © ${new Date().getFullYear()} Craig Spence`,

  highlight: {
    theme: 'default', // overridden in static/css/custom.css
    defaultLang: 'typescript'
  },

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
  discord: '712304478799527976'
};
