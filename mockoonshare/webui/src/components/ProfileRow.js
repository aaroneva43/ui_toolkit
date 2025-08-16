import React, { useState } from 'react';
import { useAtom } from 'jotai';
import ActionButton from './ActionButton';
import EndpointsList from './EndpointsList';
import { loadProfilesAtom } from '../store/profilesStore';

const ProfileRow = ({ profile }) => {
  const [showEndpoints, setShowEndpoints] = useState(profile.running || false);
  const [, loadProfiles] = useAtom(loadProfilesAtom);
  
  const profileName = profile.name.split('.').shift();
  const profileUrl = `http://${window.location.hostname}:8201/${profile.name}`;
  
  const handleCopyCommand = () => {
    const command = `npx @mockoon/cli start --data ${profileUrl}`;
    navigator.clipboard.writeText(command);
  };

  const handleToggleProfile = async () => {
    const isRunning = profile.running;
    const action = isRunning ? 'stop' : 'start';
    
    try {
      const response = await fetch(`/api/profiles/${profileName}/${action}`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log(`Profile ${action}ed:`, data);
      
      // Reload all profiles from server to get fresh state
      loadProfiles();
      setShowEndpoints(!isRunning);
      
    } catch (error) {
      console.error(`Error ${action}ing profile:`, error);
    }
  };

  const handleCopyWhistleRules = () => {
    try {
      const endpoints = JSON.parse(profile.content).routes.map(
        (route) => route.endpoint
      );
      
      const whistleRules = endpoints.map(endpoint => {
        const escapedEndpoint = endpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return `/.+(${escapedEndpoint}.*)/ https://10.106.17.18:8200/mockoonshare/${profileName}/$1`;
      }).join('\n');
      
      navigator.clipboard.writeText(whistleRules);
    } catch (error) {
      console.error('Failed to parse profile content:', error);
      const fallbackRule = `/.+(resource-api\\/v2\\/admin\\/config\\?.+)/ https://10.106.17.18:8200/mockoonshare/${profileName}/$1`;
      navigator.clipboard.writeText(fallbackRule);
    }
  };

  const handleExportSchema = async () => {
    try {
      const response = await fetch(`/api/schema/export/${profileName}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Schema exported:', data);
      
      // Open Swagger Editor with the exported schema
      const schemaUrl = `http://${window.location.hostname}:8201/${profileName}-schema.json`;
      const swaggerEditorUrl = `https://editor.swagger.io/?url=${encodeURIComponent(schemaUrl)}`;
      window.open(swaggerEditorUrl, '_blank');
      
    } catch (error) {
      console.error('Error exporting schema:', error);
    }
  };

  return (
    <tr>
      <td>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
          {profile.name}
        </a>
        
        <ActionButton
          icon="⌨️"
          title="Copy CMD"
          onClick={handleCopyCommand}
          successIcon="✅"
        />
        
        <ActionButton
          icon={profile.running ? "🚫" : "▶️"}
          title={profile.running ? "Stop profile" : "Start profile"}
          onClick={handleToggleProfile}
          loadingIcon="⏳"
        />
        
        <ActionButton
          icon="🔀"
          title="Copy Whistle Rules"
          onClick={handleCopyWhistleRules}
          successIcon="✅"
        />
        
        <ActionButton
          icon="📖"
          title="Export OpenAPI Schema"
          onClick={handleExportSchema}
          successIcon="✅"
          loadingIcon="⏳"
        />
        
        {showEndpoints && (
          <EndpointsList profile={profile} />
        )}
      </td>
    </tr>
  );
};

export default ProfileRow;
