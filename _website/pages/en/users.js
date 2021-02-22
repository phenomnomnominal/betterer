const React = require('react');

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

module.exports = function Users(props) {
  const { repoUrl, users } = props.config;
  if (!users || !users.length) {
    return null;
  }

  const editUrl = `${repoUrl}/edit/master/website/siteConfig.js`;

  return (
    <div className="mainContainer">
      <Container padding={['bottom', 'top']}>
        <div className="showcaseSection">
          <div className="prose">
            <h1>Who is Using This?</h1>
            <p>This project is used by many folks</p>
          </div>
          <div className="logos">
            {users.map((user) => (
              <a href={user.infoLink} key={user.infoLink}>
                <img src={user.image} alt={user.caption} title={user.caption} />
              </a>
            ))}
          </div>
          <p>Are you using this project?</p>
          <a href={editUrl} className="button">
            Add your company
          </a>
        </div>
      </Container>
    </div>
  );
};
