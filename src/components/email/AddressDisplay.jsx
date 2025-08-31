import React, { useState, useCallback } from 'react';
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit, faInbox, faTrash, faRefresh, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

import { emailAPI } from '../../utils/apiService.js';
import { copyToClipboard, formatDate, truncateText } from '../../utils/helpers.js';
import { useAutoRefresh } from '../../hooks/useAutoRefresh.js';
import { APP_CONFIG, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../config/constants.js';

import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import ErrorAlert from '../ui/ErrorAlert.jsx';
import SuccessToast from '../ui/SuccessToast.jsx';
import MailCard from './MailCard.jsx';

function AddressDisplay({ emails, setEmails, selectedEmail, onEmailSelect, onDeleteEmail, onClearAll, onNewEmail, onViewContent }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  const currentEmail = selectedEmail || emails[0];
  
  // Get the most up-to-date email data from the emails array
  const currentEmailData = emails.find(email => email.email === currentEmail?.email) || currentEmail;
  const currentEnvelopes = currentEmailData?.envelopes || [];

  // Auto-refresh functionality
  const refreshEmails = useCallback(async (silent = false) => {
    if (!currentEmail) return;
    
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    
    try {
      const response = await emailAPI.getEnvelopes(currentEmail.email);
      
      const updatedEmails = emails.map(email => {
        if (email.email === currentEmail.email) {
          return {
            ...email,
            envelopes: response.envelopes,
            lastChecked: new Date().toISOString()
          };
        }
        return email;
      });
      
      setEmails(updatedEmails);
      
      if (!silent) {
        setSuccess(`${SUCCESS_MESSAGES.EMAILS_REFRESHED} Found ${response.envelopes?.length || 0} emails.`);
      }
    } catch (err) {
      if (!silent) {
        setError(err.message);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [currentEmail, emails, setEmails]);

  const {
    isEnabled: autoRefreshEnabled,
    countdown: refreshCountdown,
    isRefreshing,
    toggle: toggleAutoRefresh,
    manualRefresh
  } = useAutoRefresh(refreshEmails, [currentEmail?.email]);

  const handleCopyEmail = async () => {
    if (currentEmail) {
      const copied = await copyToClipboard(currentEmail.email);
      if (copied) {
        setSuccess(SUCCESS_MESSAGES.EMAIL_COPIED);
      } else {
        setError(ERROR_MESSAGES.CLIPBOARD_ERROR);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await manualRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = useCallback((email) => {
    setEmailToDelete(email);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (emailToDelete) {
      onDeleteEmail(emailToDelete);
      setShowDeleteModal(false);
      setEmailToDelete(null);
    }
  }, [emailToDelete, onDeleteEmail]);

  const handleMailClick = async (envelope) => {
    setLoading(true);
    setError(null);
    
    try {
      const content = await emailAPI.getEmailContent(envelope.uid, currentEmail.email);
      onViewContent(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column flex-grow-1 gap-3 my-3">
      {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
      <SuccessToast show={!!success} message={success} onClose={() => setSuccess(null)} />

      <Container className="p-0 d-flex gap-3">
        <Form.Select 
          className="border-white w-75"
          value={currentEmail?.email || ''}
          onChange={(e) => {
            const selected = emails.find(email => email.email === e.target.value);
            onEmailSelect(selected);
          }}
        >
          {emails.map(email => (
            <option key={email.email} value={email.email}>
              {truncateText(email.email, APP_CONFIG.UI.MAX_EMAIL_DISPLAY_LENGTH)}
            </option>
          ))}
        </Form.Select>
        
        <Button 
          variant="outline-secondary" 
          className="d-inline-flex gap-2 justify-content-center align-items-center text-white border-white w-25"
          onClick={handleCopyEmail}
        >
          <FontAwesomeIcon icon={faCopy} />
          Copy
        </Button>
      </Container>

      <Container className="d-flex justify-content-between gap-3 p-0">
        <Button 
          variant="outline-info" 
          className="flex-grow-1 d-inline-flex gap-2 justify-content-center align-items-center"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
        >
          <FontAwesomeIcon icon={faRefresh} />
          {loading || isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        
        <Button 
          variant="outline-warning" 
          className="flex-grow-1 d-inline-flex gap-2 justify-content-center align-items-center"
          onClick={onNewEmail}
        >
          <FontAwesomeIcon icon={faEdit} />
          New
        </Button>
        
        <Button 
          variant="outline-danger" 
          className="flex-grow-1 d-inline-flex gap-2 justify-content-center align-items-center"
          onClick={() => handleDeleteClick(currentEmail?.email)}
        >
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </Button>
      </Container>

      {/* Auto-refresh controls */}
      <Container className="d-flex justify-content-between align-items-center p-0 mb-2">
        <Button 
          variant={autoRefreshEnabled ? "outline-success" : "outline-secondary"}
          size="sm"
          className="d-inline-flex gap-2 align-items-center"
          onClick={toggleAutoRefresh}
        >
          <FontAwesomeIcon icon={autoRefreshEnabled ? faPause : faPlay} />
          Auto-refresh {autoRefreshEnabled ? 'ON' : 'OFF'}
        </Button>
        
        {autoRefreshEnabled && (
          <small className="text-muted">
            Next refresh in {refreshCountdown}s
          </small>
        )}
      </Container>

      <Card className="border-white flex-grow-1 mt-3 mb-5">
        <Card.Header className="border-bottom border-white d-inline-flex gap-2 align-items-center justify-content-between">
          <div className="d-inline-flex gap-2 align-items-center">
            <FontAwesomeIcon icon={faInbox} />
            INBOX ({currentEnvelopes.length})
          </div>
          {currentEmailData?.lastChecked && (
            <small className="text-muted">
              Last checked: {formatDate(currentEmailData.lastChecked)}
            </small>
          )}
        </Card.Header>
        
        <Card.Body className="d-flex flex-column gap-3 flex-grow-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading && <LoadingSpinner text="Loading emails..." />}
          
          {!loading && currentEnvelopes.length === 0 && (
            <div className="text-center m-auto">
              <p className="text-muted">No emails received yet.</p>
              <Button variant="outline-primary" size="sm" onClick={handleRefresh}>
                <FontAwesomeIcon icon={faRefresh} className="me-2" />
                Check for emails
              </Button>
            </div>
          )}
          
          {!loading && currentEnvelopes.length > 0 && currentEnvelopes.map(envelope => (
            <MailCard 
              key={envelope.uid} 
              envelope={envelope} 
              onClick={() => handleMailClick(envelope)}
            />
          ))}
        </Card.Body>
      </Card>

      {emails.length > 1 && (
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={onClearAll}
          className="mt-2"
        >
          Clear All Emails
        </Button>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the email address <strong>{emailToDelete}</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddressDisplay;