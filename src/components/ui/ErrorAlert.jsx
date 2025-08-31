import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <Alert variant="danger" dismissible onClose={onDismiss} className="mb-3">
      <Alert.Heading>Error</Alert.Heading>
      <p className="mb-0">{error}</p>
    </Alert>
  );
};

export default ErrorAlert;