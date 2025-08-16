import { atom } from 'jotai';

// Atom for profiles data
export const profilesAtom = atom([]);

// Atom for loading state
export const profilesLoadingAtom = atom(false);

// Atom for error state
export const profilesErrorAtom = atom(null);

// Atom for loading profiles (async action)
export const loadProfilesAtom = atom(
  null, // read function (not needed for write-only atom)
  async (get, set) => {
    try {
      set(profilesLoadingAtom, true);
      set(profilesErrorAtom, null);
      
      const response = await fetch('/api/profiles');
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      
      const data = await response.json();
      set(profilesAtom, data);
    } catch (error) {
      set(profilesErrorAtom, error.message);
      console.error('Failed to load profiles:', error);
    } finally {
      set(profilesLoadingAtom, false);
    }
  }
);

// Atom for updating a single profile
export const updateProfileAtom = atom(
  null,
  (get, set, updatedProfile) => {
    const currentProfiles = get(profilesAtom);
    const newProfiles = currentProfiles.map(profile => 
      profile.name === updatedProfile.name ? updatedProfile : profile
    );
    set(profilesAtom, newProfiles);
  }
);
