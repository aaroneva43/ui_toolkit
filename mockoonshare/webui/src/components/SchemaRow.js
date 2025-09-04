import React, { useState } from 'react';
import { useAtom } from 'jotai';
import ActionButton from './ActionButton';
import { loadSchemasAtom } from '../store/schemasStore';

/**
 * @param {Object} props
 * @param {Object} props.schema
 * @param {function} [props.onOpenSwaggerEditor]
 * @param {function} [props.onShowError]
 */
const SchemaRow = ({ schema, onOpenSwaggerEditor, onShowError }) => {
  const [, loadSchemas] = useAtom(loadSchemasAtom);
  
  const schemaName = schema.name.replace('.json', '');
  const schemaUrl = `http://${window.location.hostname}:8201/${schema.name}`;
  
  const handleCopySchemaUrl = () => {
    navigator.clipboard.writeText(schemaUrl);
  };

  const handleViewSchema = async () => {
    try {
      const response = await fetch(`/api/schema/export/${schemaName}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to retrieve schema');
      }
      
      const data = await response.json();
      console.log('Schema retrieved:', data);
      
      // Parse and prepare schema for Swagger Editor
      let parsedSchema = null;
      try {
        parsedSchema = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      } catch (parseError) {
        throw new Error('Invalid schema format received from server');
      }
      
      if (typeof onOpenSwaggerEditor === 'function') {
        // Keep original servers or add a default one
        if (!parsedSchema.servers || parsedSchema.servers.length === 0) {
          parsedSchema = {
            ...parsedSchema,
            servers: [
              {
                url: `${window.location.origin}/mockoonshare/${schemaName}`,
              },
            ],
          };
        }
        onOpenSwaggerEditor(parsedSchema);
      }
    } catch (error) {
      console.error('Error viewing schema:', error);
      if (typeof onShowError === 'function') {
        onShowError(`Failed to view schema for "${schemaName}": ${error.message}`);
      }
    }
  };

  const handleDeleteSchema = async () => {
    if (!window.confirm(`Are you sure you want to delete the schema for "${schemaName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/schemas/${schemaName}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete schema');
      }
      
      console.log('Schema deleted successfully');
      loadSchemas(); // Reload schemas after deletion
      
    } catch (error) {
      console.error('Error deleting schema:', error);
      if (typeof onShowError === 'function') {
        onShowError(`Failed to delete schema for "${schemaName}": ${error.message}`);
      }
    }
  };

  return (
    <tr>
      <td>
        <a href={schemaUrl} target="_blank" rel="noopener noreferrer">
          {schema.name}
        </a>
        <ActionButton
          icon="📋"
          title="Copy Schema URL"
          onClick={handleCopySchemaUrl}
          successIcon="✅"
        />
        <ActionButton
          icon="📖"
          title="View Schema"
          onClick={handleViewSchema}
          successIcon="✅"
          loadingIcon="⏳"
        />
        <ActionButton
          icon="🗑️"
          title="Delete Schema"
          onClick={handleDeleteSchema}
          successIcon="✅"
          loadingIcon="⏳"
        />
      </td>
    </tr>
  );
};

export default SchemaRow;
