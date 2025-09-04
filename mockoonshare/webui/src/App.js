import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import ProfileTable from './components/ProfileTable';
import SchemaTable from './components/SchemaTable';
import DragDropArea from './components/DragDropArea';
import DropdownMenu from './components/DropdownMenu';
import { profilesAtom, profilesLoadingAtom, profilesErrorAtom, loadProfilesAtom } from './store/profilesStore';
import { schemasAtom, schemasLoadingAtom, schemasErrorAtom, loadSchemasAtom } from './store/schemasStore';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('profiles');
  
  // Profiles state
  const [profiles] = useAtom(profilesAtom);
  const [profilesLoading] = useAtom(profilesLoadingAtom);
  const [profilesError] = useAtom(profilesErrorAtom);
  const [, loadProfiles] = useAtom(loadProfilesAtom);
  
  // Schemas state
  const [schemas] = useAtom(schemasAtom);
  const [schemasLoading] = useAtom(schemasLoadingAtom);
  const [schemasError] = useAtom(schemasErrorAtom);
  const [, loadSchemas] = useAtom(loadSchemasAtom);

  useEffect(() => {
    loadProfiles();
    loadSchemas();
  }, [loadProfiles, loadSchemas]);

  const handleAddSuite = () => {
    // Placeholder function for Add Suite functionality
    console.log('Add Suite clicked');
    alert('Add Suite functionality coming soon!');
  };

  const dropdownItems = [
    {
      label: 'Add Suite',
      icon: '➕',
      onClick: handleAddSuite
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUpload = () => {
    if (activeTab === 'profiles') {
      loadProfiles();
    } else {
      loadSchemas();
    }
  };

  const isLoading = activeTab === 'profiles' ? profilesLoading : schemasLoading;
  const error = activeTab === 'profiles' ? profilesError : schemasError;
  const data = activeTab === 'profiles' ? profiles : schemas;

  return (
    <div className="container">
      <DropdownMenu items={dropdownItems} />
      
      <h2>This is a Shared Mockoon Server for easy mock-data accessibility.</h2>
      <br />
      
      {/* Tab Menu */}
      <div className="tab-menu">
        <button 
          className={`tab-button ${activeTab === 'profiles' ? 'active' : ''}`}
          onClick={() => handleTabChange('profiles')}
        >
          📋 Profiles
        </button>
        <button 
          className={`tab-button ${activeTab === 'schemas' ? 'active' : ''}`}
          onClick={() => handleTabChange('schemas')}
        >
          📖 Schemas
        </button>
      </div>
      
      <div className="instruction">
        <p>
          {activeTab === 'profiles' 
            ? "You can run your Mockoon Server here, or run it locally by clicking the 📋 icon to copy the command"
            : "View and manage OpenAPI schemas generated from your Mockoon profiles"
          }
        </p>
      </div>
      
      {activeTab === 'profiles' && (
        <div className="instruction">
          <p>
           Click the 🔀 icon to copy the Whistle Rules
          </p>
        </div>
      )}

      {isLoading && <p>Loading {activeTab}...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <DragDropArea onUpload={handleUpload} mode={activeTab} />
      
      {!isLoading && !error && (
        <>
          {activeTab === 'profiles' ? (
            <ProfileTable profiles={data} />
          ) : (
            <SchemaTable schemas={data} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
