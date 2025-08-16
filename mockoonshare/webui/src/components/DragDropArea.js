import React, { useState } from 'react';

const DragDropArea = ({ onUpload }) => {
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
      const id = fileName.replace('.json', '');

      const response = await fetch(`/api/profiles/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: content,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${fileName}`);
      }

      console.log(`Successfully uploaded ${fileName}`);
      onUpload(); // Refresh the profiles list

    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      alert(`Failed to upload ${file.name}: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

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
          <p>Drag & drop your Mockoon profile here</p>
          <small>Files with existing names will be overwritten</small>
        </div>
      )}
    </div>
  );
};

export default DragDropArea;
