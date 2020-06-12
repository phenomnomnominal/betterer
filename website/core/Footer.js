const React = require('react');

module.exports = function Footer({ config, language = '' }) {
  const { baseUrl, docsUrl, footerIcon, repoUrl, title } = config;

  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;

  function docUrl(doc) {
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  function pageUrl(doc) {
    return `${baseUrl}${langPart}${doc}`;
  }

  return (
    <footer className="nav-footer" id="footer">
      <section className="sitemap">
        <a href={baseUrl} className="nav-home">
          {footerIcon && <img src={baseUrl + footerIcon} alt={title} />}
        </a>
        <div>
          <h5>Docs</h5>
          <a href={docUrl('getting-started.html')}>Getting Started</a>
          <a href={docUrl('guides.html')}>Guides</a>
          <a href={docUrl('api.html')}>API Reference</a>
        </div>
        <div>
          <h5>Community</h5>
          <a href={pageUrl('users.html')}>User Showcase</a>
          <a href="https://stackoverflow.com/questions/tagged/betterer" target="_blank" rel="noreferrer noopener">
            Stack Overflow
          </a>
          <a href={`https://discord.com/channels/${config.discord}`}>Project Chat</a>
          <a href={`https://twitter.com/${config.twitter}`} target="_blank" rel="noreferrer noopener">
            Twitter
          </a>
        </div>
        <div>
          <h5>More</h5>
          <a href={`${baseUrl}blog`}>Blog</a>
          <a href={repoUrl}>GitHub</a>
          <a
            className="github-button"
            href={repoUrl}
            data-icon="octicon-star"
            data-count-href="/phenomnomnominal/betterer/stargazers"
            data-show-count="true"
            data-count-aria-label="# stargazers on GitHub"
            aria-label="Star this project on GitHub"
          >
            Star
          </a>
        </div>
      </section>

      <section className="copyright">
        <p>{config.copyright}</p>
      </section>
    </footer>
  );
};
