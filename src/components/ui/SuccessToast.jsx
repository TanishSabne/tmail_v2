import React, { useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const SuccessToast = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
      <Toast show={show} onClose={onClose} bg="success">
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default SuccessToast;