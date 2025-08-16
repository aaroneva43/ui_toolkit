import React from 'react';

const EndpointsList = ({ profile }) => {
  const profileName = profile.name.split('.').shift();
  
  let endpoints = [];
  try {
    endpoints = JSON.parse(profile.content).routes.map(
      (route) => route.endpoint
    );
  } catch (error) {
    console.error('Failed to parse profile content:', error);
    return null;
  }

  return (
    <div className="endpoints">
      {endpoints.map((endpoint, index) => {
        const endpointUrl = `${window.location.origin}/mockoonshare/${profileName}/${endpoint}`;
        const displayText = `/mockoonshare/${profileName}/${endpoint}`;
        
        return (
          <a
            key={index}
            href={endpointUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayText}
          </a>
        );
      })}
    </div>
  );
};

export default EndpointsList;
