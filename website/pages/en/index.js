const React = require('react');
const { MarkdownBlock, Container, GridBlock } = require('../../core/CompLibrary.js');

function HomeSplash(props) {
  const { siteConfig, language = '' } = props;
  const { baseUrl, docsUrl } = siteConfig;

  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;

  function docUrl(doc) {
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  return (
    <HomeSplashContainer>
      <HomeLogo img_src={`${baseUrl}img/betterer.png`} />
      <HomeTitle title={siteConfig.title} tagline={siteConfig.tagline} />
      <HomeCode />
      <HomePromoSection>
        <HomeButton href={docUrl('getting-started.html')}>Get started</HomeButton>
        <HomeButton href={docUrl('tests.html')}>Examples</HomeButton>
        <HomeButton href={docUrl('api.html')}>API Docs</HomeButton>
      </HomePromoSection>
    </HomeSplashContainer>
  );
}

function HomeSplashContainer(props) {
  return (
    <div className="homeContainer">
      <div className="homeWrapper">{props.children}</div>
    </div>
  );
}

function HomeLogo(props) {
  return (
    <div className="projectLogo">
      <img src={props.img_src} alt="Betterer Logo" />
    </div>
  );
}

function HomeTitle(props) {
  return (
    <h2 className="projectTitle">
      {props.title}
      <small>{props.tagline}</small>
    </h2>
  );
}

function HomeCode() {
  return (
    <iframe
      tabIndex="-1"
      className="projectInitScript"
      title="Betterer Get Started code snippet"
      src="https://carbon.now.sh/embed/?bg=rgba(171%2C184%2C195%2C0)&t=3024-night&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=16px&ph=15px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%2523%2520run%2520this%2520in%2520your%2520project%2520to%2520get%2520betterer%250Anpx%2520%2540betterer%252Fcli%2520init"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  );
}

function HomePromoSection(props) {
  return (
    <div className="section promoSection">
      <div className="promoRow">
        <div className="pluginRowBlock">{props.children}</div>
      </div>
    </div>
  );
}

function HomeButton(props) {
  return (
    <a className="button" href={props.href} target={props.target}>
      {props.children}
    </a>
  );
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = (props) => (
      <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
        <GridBlock align="center" contents={props.children} layout={props.layout} />
      </Container>
    );

    const FeatureCallout = () => (
      <div className="productShowcaseSection paddingBottom" style={{ textAlign: 'center' }}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations'
          }
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content: 'This is another description of how this project is useful',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'Description'
          }
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content: 'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors'
          }
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: "Create tests that encapsulate improvements you'd like to make in your codebase",
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            title: 'Define goals'
          },
          {
            content: 'Track the current status and prevent creating new issues',
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            title: 'Prevent regressions'
          },
          {
            content: 'Set deadlines and ',
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: 'top',
            title: 'Encourage improvement'
          }
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter((user) => user.pinned)
        .map((user) => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = (page) => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by some people:</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
