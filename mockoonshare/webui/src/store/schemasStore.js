import { atom } from 'jotai';

// Base atoms
export const schemasAtom = atom([]);
export const schemasLoadingAtom = atom(false);
export const schemasErrorAtom = atom(null);

// Derived atom for loading schemas
export const loadSchemasAtom = atom(
  null,
  async (get, set) => {
    set(schemasLoadingAtom, true);
    set(schemasErrorAtom, null);
    
    try {
      const response = await fetch('/api/schemas');
      if (!response.ok) {
        throw new Error('Failed to fetch schemas');
      }
      const schemas = await response.json();
      set(schemasAtom, schemas);
    } catch (error) {
      console.error('Error loading schemas:', error);
      set(schemasErrorAtom, error.message);
    } finally {
      set(schemasLoadingAtom, false);
    }
  }
);
