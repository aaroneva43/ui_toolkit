import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import ProfileTable from './components/ProfileTable';
import DragDropArea from './components/DragDropArea';
import DropdownMenu from './components/DropdownMenu';
import { profilesAtom, profilesLoadingAtom, profilesErrorAtom, loadProfilesAtom } from './store/profilesStore';
import './index.css';

function App() {
  const [profiles] = useAtom(profilesAtom);
  const [loading] = useAtom(profilesLoadingAtom);
  const [error] = useAtom(profilesErrorAtom);
  const [, loadProfiles] = useAtom(loadProfilesAtom);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

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

  return (
    <div className="container">
      <DropdownMenu items={dropdownItems} />
      
      <h2>This is a Shared Mockoon Server for easy mock-data accessibility.</h2>
      <br />
      
      <div className="instruction">
        <p>
          You can run your Mockoon Server here, or run it locally by clicking the 📋 icon to copy the command
        </p>
      </div>
      
      <div className="instruction">
        <p>
         Click the 🔀 icon to copy the Whistle Rules
        </p>
      </div>

      {loading && <p>Loading profiles...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <DragDropArea onUpload={loadProfiles} />
      
      {!loading && !error && (
        <ProfileTable 
          profiles={profiles} 
        />
      )}
    </div>
  );
}

export default App;
