import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const FEATURES = [
  {
    title: 'Define goals',
    description: (
      <>
        Create tests that encapsulate improvements you'd like to make in your codebase.
      </>
    ),
  },
  {
    title: 'Prevent regressions',
    description: (
      <>
        Track the current status and prevent creating new issues.
      </>
    ),
  },
  {
    title: 'Encourage improvement',
    description: (
      <>
        Set deadlines and track progress towards your goals!
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const homeImageURL = useBaseUrl('img/betterer.png');

  function docUrl(doc) {
    return useBaseUrl(`docs/${doc}`);
  }

  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />">

      <HomeSplashContainer>
        <HomeLogo imgUrl={homeImageURL} />
        <HomeIntro>
          <HomeTitle title={siteConfig.title} tagline={siteConfig.tagline} />
          <HomeCode />
          <HomePromoSection>
            <HomeButton href={useBaseUrl('docs/introduction')}>Introduction</HomeButton>
            <HomeButton href={useBaseUrl('docs/installation')}>Get started</HomeButton>
            <HomeButton href={useBaseUrl('docs/api')}>API Docs</HomeButton>
          </HomePromoSection>
        </HomeIntro>
      </HomeSplashContainer>

      <main>
        {FEATURES.length > 0 && <HomeFeatures features={FEATURES}/>}
      </main>
    </Layout>
  );
}

export default Home;

function HomeSplashContainer(props) {
  return (
    <div className={clsx('hero hero--primary', styles.homeHeroBanner)}>
      <div className={clsx('container', styles.homeContainer)}>{props.children}</div>
    </div>
  );
}

function HomeLogo(props) {
  return (
    <div className={clsx(styles.projectLogo)} >
      <img src={props.imgUrl} alt="Betterer Logo" />
    </div>
  );
}

function HomeIntro (props) {
  return (
    <div className={clsx(styles.homeIntro)}>{props.children}</div>
  )
}

function HomeTitle(props) {
  return (
    <div>
      <h1 className={clsx('hero__title', styles.heroTitle)}>{props.title}</h1>
      <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{props.tagline}</p>
    </div>
  );
}

function HomeCode() {
  return (
    <iframe
      seamless
      tabIndex="-1"
      className={clsx(styles.projectInitScript)}
      title="Betterer Get Started code snippet"
      src="https://carbon.now.sh/embed?bg=rgba%28255%2C255%2C255%2C0%29&t=seti&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=16px&ph=15px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%2523%2520run%2520this%2520in%2520your%2520project%2520to%2520get%2520betterer%250Anpx%2520%2540betterer%252Fcli%2520init"
      sandbox="allow-scripts allow-same-origin">
    </iframe>
  );
}

function HomePromoSection(props) {
  return (
    <div className={styles.buttons}>{props.children}</div>
  );
}

function HomeButton(props) {
  return (
    <Link
      className={clsx(
        'button button--primary button--lg',
        styles.homeButton
      )}
      to={props.href}>
      {props.children}
    </Link>
  );
}

function HomeFeatures(props) {
  return <section className={styles.features}>
    <div className="container">
      <div className="row">
        {props.features.map((props, idx) => <HomeFeature key={idx} {...props} />)}
      </div>
    </div>
  </section>
}


function HomeFeature(props) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  );
}
