import React, { useState } from 'react';
import { Button, Card, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import ErrorAlert from '../ui/ErrorAlert.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function MailContentDisplay({ emailContent, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!emailContent) {
    return (
      <Container className="d-flex flex-column h-100">
        <p className="text-muted">No email content to display.</p>
        <Button variant="outline-secondary" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Inbox
        </Button>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column h-100 gap-3">
      <div className="d-flex align-items-center gap-3">
        <Button variant="outline-secondary" size="sm" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <h5 className="mb-0 flex-grow-1 text-start">Email Content</h5>
      </div>

      <Card className="border-white flex-grow-1">
        <Card.Header className="border-bottom border-white">
          <h6 className="mb-2 text-start">{emailContent.subject}</h6>
          <div className="text-start small">
            <p className="mb-1"><strong>From:</strong> {emailContent.sender}</p>
            <p className="mb-1"><strong>To:</strong> {emailContent.recipient}</p>
            <p className="mb-0"><strong>Date:</strong> {new Date(emailContent.date).toLocaleString()}</p>
          </div>
        </Card.Header>
        
        <Card.Body className="text-start" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
          
          {loading && <LoadingSpinner text="Loading content..." />}
          
          {!loading && emailContent.html_content && (
            <div 
              className="force-white-text"
              dangerouslySetInnerHTML={{ __html: emailContent.html_content }}
              style={{ wordBreak: 'break-word' }}
            />
          )}
          
          {!loading && !emailContent.html_content && emailContent.text_content && (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {emailContent.text_content}
            </pre>
          )}
          
          {!loading && !emailContent.html_content && !emailContent.text_content && (
            <p className="text-muted">No content available for this email.</p>
          )}
        </Card.Body>
        
        {emailContent.has_attachments && (
          <Card.Footer className="border-top border-white">
            <small className="text-info">
              📎 This email has {emailContent.attachment_count} attachment(s)
            </small>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
}

export default MailContentDisplay;