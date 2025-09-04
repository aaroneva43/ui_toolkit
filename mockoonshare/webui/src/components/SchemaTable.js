import React from 'react';
import SchemaRow from './SchemaRow';
import SwaggerEditorLayer from './SwaggerEditorLayer';
import ErrorPopup from './ErrorPopup';

const SchemaTable = ({ schemas }) => {
  const [swaggerOpen, setSwaggerOpen] = React.useState(false);
  const [swaggerSchema, setSwaggerSchema] = React.useState(null);
  const [errorPopup, setErrorPopup] = React.useState({ show: false, message: '' });

  const handleOpenSwaggerEditor = (schema) => {
    setSwaggerSchema(schema);
    setSwaggerOpen(true);
  };

  const handleShowError = (message) => {
    setErrorPopup({ show: true, message });
  };

  const handleCloseError = () => {
    setErrorPopup({ show: false, message: '' });
  };

  return (
    <>
      <table>
        <tbody>
          {schemas.map((schema) => (
            <SchemaRow 
              key={schema.name} 
              schema={schema}
              onOpenSwaggerEditor={handleOpenSwaggerEditor}
              onShowError={handleShowError}
            />
          ))}
        </tbody>
      </table>
      <SwaggerEditorLayer
        open={swaggerOpen}
        schema={swaggerSchema}
        onClose={() => setSwaggerOpen(false)}
      />
      <ErrorPopup
        show={errorPopup.show}
        message={errorPopup.message}
        onClose={handleCloseError}
      />
    </>
  );
};

export default SchemaTable;
