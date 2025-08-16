import React, { useState } from 'react';

const ActionButton = ({ 
  icon, 
  title, 
  onClick, 
  className = '', 
  successIcon = '✅', 
  loadingIcon = '⏳',
  showText = true 
}) => {
  const [currentIcon, setCurrentIcon] = useState(icon);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    if (loadingIcon) {
      setIsLoading(true);
      setCurrentIcon(loadingIcon);
    }
    
    try {
      await onClick();
      
      if (successIcon) {
        setCurrentIcon(successIcon);
        setTimeout(() => {
          setCurrentIcon(icon || '');
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setCurrentIcon(icon || '');
      setIsLoading(false);
      console.error('Action failed:', error);
    }
  };

  return (
    <button
      className={`action-btn ${className}`}
      title={title}
      onClick={handleClick}
      disabled={isLoading}
    >
      {showText ? currentIcon : ''}
    </button>
  );
};

export default ActionButton;
