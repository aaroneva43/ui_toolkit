import React from 'react';
import ProfileRow from './ProfileRow';

const ProfileTable = ({ profiles }) => {
  return (
    <table>
      <tbody>
        {profiles.map((profile) => (
          <ProfileRow 
            key={profile.name} 
            profile={profile} 
          />
        ))}
      </tbody>
    </table>
  );
};

export default ProfileTable;
