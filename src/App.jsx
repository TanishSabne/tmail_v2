import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container } from "react-bootstrap";

// Import utilities and components
import { saveEmailsToCookie, getEmailsFromCookie, clearAllEmails, areCookiesEnabled } from './utils/cookieManager.js';
import { APP_CONFIG, SUCCESS_MESSAGES } from './config/constants.js';

// Components
import ErrorAlert from './components/ui/ErrorAlert.jsx';
import SuccessToast from './components/ui/SuccessToast.jsx';
import ErrorBoundary from './components/layout/ErrorBoundary.jsx';
import OfflineIndicator from './components/layout/OfflineIndicator.jsx';
import AddressGenerate from './components/email/AddressGenerate.jsx';
import AddressDisplay from './components/email/AddressDisplay.jsx';
import MailContentDisplay from './components/email/MailContentDisplay.jsx';

function App() {
  const [emails, setEmails] = useState([]);
  const [currentView, setCurrentView] = useState('generate');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmailContent, setSelectedEmailContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load emails from cookies on component mount
  useEffect(() => {
    const savedEmails = getEmailsFromCookie();
    if (savedEmails.length > 0) {
      setEmails(savedEmails);
      setCurrentView('display');
    }
  }, []);

  // Save emails to cookies whenever emails state changes
  useEffect(() => {
    if (emails.length > 0) {
      try {
        saveEmailsToCookie(emails);
      } catch (err) {
        console.error('Failed to save emails:', err);
      }
    }
  }, [emails]);

  const handleEmailGenerated = useCallback((newEmail) => {
    const emailData = {
      email: newEmail.email,
      timestamp: new Date().toISOString(),
      envelopes: [],
      lastChecked: null
    };
    
    setEmails(prev => [...prev, emailData]);
    setSelectedEmail(emailData);
    setCurrentView('display');
    setSuccess(SUCCESS_MESSAGES.EMAIL_GENERATED);
  }, []);

  const handleDeleteEmail = useCallback((emailToDelete) => {
    setEmails(prev => {
      const updatedEmails = prev.filter(email => email.email !== emailToDelete);
      
      if (updatedEmails.length === 0) {
        clearAllEmails();
        setCurrentView('generate');
      }
      
      return updatedEmails;
    });
    
    setSuccess(SUCCESS_MESSAGES.EMAIL_DELETED);
  }, []);

  const handleClearAll = useCallback(() => {
    setEmails([]);
    clearAllEmails();
    setCurrentView('generate');
    setSuccess(SUCCESS_MESSAGES.EMAILS_CLEARED);
  }, []);

  const handleNewEmail = useCallback(() => {
    setCurrentView('generate');
  }, []);

  const handleEmailSelect = useCallback((email) => {
    setSelectedEmail(email);
  }, []);

  const handleViewContent = useCallback((emailContent) => {
    setSelectedEmailContent(emailContent);
    setCurrentView('content');
  }, []);

  const handleBackToInbox = useCallback(() => {
    setCurrentView('display');
    setSelectedEmailContent(null);
  }, []);

  // Memoize current view component to prevent unnecessary re-renders
  const currentViewComponent = useMemo(() => {
    switch (currentView) {
      case 'generate':
        return <AddressGenerate onEmailGenerated={handleEmailGenerated} />;
      case 'display':
        return (
          <AddressDisplay 
            emails={emails}
            setEmails={setEmails}
            selectedEmail={selectedEmail}
            onEmailSelect={handleEmailSelect}
            onDeleteEmail={handleDeleteEmail}
            onClearAll={handleClearAll}
            onNewEmail={handleNewEmail}
            onViewContent={handleViewContent}
          />
        );
      case 'content':
        return (
          <MailContentDisplay 
            emailContent={selectedEmailContent}
            onBack={handleBackToInbox}
          />
        );
      default:
        return <AddressGenerate onEmailGenerated={handleEmailGenerated} />;
    }
  }, [
    currentView,
    emails,
    selectedEmail,
    selectedEmailContent,
    handleEmailGenerated,
    handleEmailSelect,
    handleDeleteEmail,
    handleClearAll,
    handleNewEmail,
    handleViewContent,
    handleBackToInbox
  ]);

  return (
    <ErrorBoundary>
      <Container className="text-center d-flex flex-column h-100 p-3" style={{maxWidth: "500px"}}>
        <h1 className="h1 my-5">{APP_CONFIG.NAME}</h1>
        
        <OfflineIndicator />
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
        <SuccessToast show={!!success} message={success} onClose={() => setSuccess(null)} />
        
        {currentViewComponent}
      </Container>
    </ErrorBoundary>
  );
}

export default App;