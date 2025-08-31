import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineAlert) {
    return null;
  }

  return (
    <Alert 
      variant="warning" 
      className="mb-3 d-flex align-items-center"
      dismissible 
      onClose={() => setShowOfflineAlert(false)}
    >
      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
      <div>
        <strong>You're offline</strong>
        <div className="small">
          Some features may not work properly. Please check your internet connection.
        </div>
      </div>
    </Alert>
  );
};

export default OfflineIndicator;