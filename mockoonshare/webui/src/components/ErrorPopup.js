import React from 'react';

const ErrorPopup = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="error-popup-overlay" onClick={onClose}>
      <div className="error-popup" onClick={(e) => e.stopPropagation()}>
        <div className="error-popup-header">
          <span className="error-icon">⚠️</span>
          <h3>Error</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="error-popup-content">
          <p>{message}</p>
        </div>
        <div className="error-popup-footer">
          <button className="ok-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
