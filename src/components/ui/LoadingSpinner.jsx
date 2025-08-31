import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'sm', text = 'Loading...' }) => {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <Spinner animation="border" size={size} />
      <span>{text}</span>
    </div>
  );
};

export default LoadingSpinner;