import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="text-center d-flex flex-column justify-content-center align-items-center min-vh-100">
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Something went wrong
            </Alert.Heading>
            <p className="mb-3">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-3">
                <summary className="mb-2">Error Details (Development)</summary>
                <pre className="text-start small">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="d-flex gap-2 justify-content-center mt-3">
              <Button variant="outline-primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="primary" onClick={this.handleReload}>
                <FontAwesomeIcon icon={faRefresh} className="me-2" />
                Reload Page
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;