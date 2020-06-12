const React = require('react');

const { Container, GridBlock } = require('../../core/CompLibrary.js');

module.exports = function Help({ config, language = '' }) {
  const { baseUrl, docsUrl } = config;

  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;

  function docUrl(doc) {
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  function pageUrl(doc) {
    return `${baseUrl}${langPart}${doc}`;
  }

  const supportLinks = [
    {
      content: `Learn more using the [documentation on this site.](${docUrl('getting-started.html')})`,
      title: 'Browse Docs'
    },
    {
      content: `[Ask questions](https://discord.com/channels/${config.discord}) about the documentation and project`,
      title: 'Join the community'
    },
    {
      content: `Find out [what's new](${pageUrl('blog')}) with this project`,
      title: 'Stay up to date'
    }
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <p>This project is maintained by a dedicated group of people.</p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
};
