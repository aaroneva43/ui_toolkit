import React, { useState } from 'react';

const DragDropArea = ({ onUpload, mode = 'profiles' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      alert('Please drop JSON files only');
      return;
    }

    for (const file of jsonFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const content = await file.text();
      
      // Validate JSON
      try {
        JSON.parse(content);
      } catch (e) {
        alert(`Invalid JSON file: ${file.name}`);
        return;
      }

      const fileName = file.name;
      let id, endpoint;
      
      if (mode === 'schemas') {
        // For schemas, just remove .json suffix (no more -schema suffix needed)
        id = fileName.replace('.json', '');
        endpoint = `/api/schemas/${id}`;
      } else {
        // For profiles, remove .json suffix
        id = fileName.replace('.json', '');
        endpoint = `/api/profiles/${id}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: content,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload ${fileName}`);
      }

      console.log(`Successfully uploaded ${fileName}`);
      onUpload(); // Refresh the list

    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      alert(`Failed to upload ${file.name}: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getDropText = () => {
    if (mode === 'schemas') {
      return {
        main: 'Drag & drop your OpenAPI schema here',
        sub: 'JSON schema files will be uploaded to the schemas directory'
      };
    } else {
      return {
        main: 'Drag & drop your Mockoon profile here',
        sub: 'Files with existing names will be overwritten'
      };
    }
  };

  const dropText = getDropText();

  return (
    <div
      className={`drag-drop-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="upload-status">
          <span>📤</span>
          <p>Uploading...</p>
        </div>
      ) : (
        <div className="drop-content">
          <span>📁</span>
          <p>{dropText.main}</p>
          <small>{dropText.sub}</small>
        </div>
      )}
    </div>
  );
};

export default DragDropArea;
