import React, { useState } from 'react';
import { useAtom } from 'jotai';
import ActionButton from './ActionButton';
import EndpointsList from './EndpointsList';
import { loadProfilesAtom } from '../store/profilesStore';

/**
 * @param {Object} props
 * @param {Object} props.profile
 * @param {function} [props.onOpenSwaggerEditor]
 * @param {function} [props.onShowError]
 */
const ProfileRow = ({ profile, onOpenSwaggerEditor, onShowError }) => {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      const data = await response.json();
      console.log(`Profile ${action}ed:`, data);
      
      // Reload all profiles from server to get fresh state
      loadProfiles();
      setShowEndpoints(!isRunning);
      
    } catch (error) {
      console.error(`Error ${action}ing profile:`, error);
      if (typeof onShowError === 'function') {
        onShowError(`Failed to ${action} profile "${profileName}": ${error.message}`);
      }
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
      // Use the new POST endpoint that only returns schema
      const response = await fetch(`/api/profiles/${profileName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to retrieve schema');
      }
      
      const data = await response.json();
      console.log('Schema retrieved:', data);
      
      // Parse and prepare schema for Swagger Editor
      let schema = null;
      try {
        schema = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      } catch (parseError) {
        throw new Error('Invalid schema format received from server');
      }
      
      if (typeof onOpenSwaggerEditor === 'function') {
        // Update baseUrl with prefix: /mockoonshare/${profileName}
        schema = {
          ...schema,
          servers: [
            {
              url: `${window.location.origin}/mockoonshare/${profileName}`,
            },
          ],
        };
        onOpenSwaggerEditor(schema);
      }
    } catch (error) {
      console.error('Error exporting schema:', error);
      if (typeof onShowError === 'function') {
        onShowError(`Failed to export schema for "${profileName}": ${error.message}`);
      }
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
        {profile.schemaPath !== null && (
          <ActionButton
            icon="📖"
            title="Export OpenAPI Schema"
            onClick={handleExportSchema}
            successIcon="✅"
            loadingIcon="⏳"
          />
        )}
        {showEndpoints && (
          <EndpointsList profile={profile} />
        )}
      </td>
    </tr>
  );
};

export default ProfileRow;
