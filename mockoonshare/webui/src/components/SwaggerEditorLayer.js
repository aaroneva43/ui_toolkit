import React, { useEffect, useState } from 'react';
import './SwaggerEditorLayer.css';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerEditorLayer = ({ open, schema, onClose }) => {
  return (
    <div className={`swagger-editor-layer${open ? ' open' : ''}`}> 
      <div className="swagger-editor-header">
        <button className="close-btn" onClick={onClose}>×</button>
        <span>Swagger Editor</span>
      </div>
      <div style={{ width: '100%', height: 'calc(100vh - 48px)', overflow: 'auto' }}>
        {schema ? (
          <SwaggerUI spec={schema} />
        ) : (
          <div style={{padding: '2em'}}>No OpenAPI schema provided.</div>
        )}
      </div>
    </div>
  );
};

export default SwaggerEditorLayer;
