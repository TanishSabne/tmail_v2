import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Container, FormControl, FormSelect, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";

import { emailAPI } from '../../utils/apiService.js';
import { generateRandomUsername, validateUsername, debounce } from '../../utils/helpers.js';
import { APP_CONFIG } from '../../config/constants.js';
import ErrorAlert from '../ui/ErrorAlert.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function AddressGenerate({ onEmailGenerated }) {
  const [username, setUsername] = useState('');
  const [domain, setDomain] = useState('iiita.bar');
  const [domains, setDomains] = useState(['iiita.bar', 'fieryking.fun']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced username validation
  const debouncedValidation = useMemo(
    () => debounce((value) => {
      if (value && !validateUsername(value)) {
        setError('Username must be 3-20 characters, start with a letter, and contain only lowercase letters and numbers.');
      } else {
        setError(null);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedValidation(username);
  }, [username, debouncedValidation]);

  useEffect(() => {
    const loadDomains = async () => {
      try {
        const response = await emailAPI.getDomains();
        setDomains(response.domains);
        if (response.domains.length > 0) {
          setDomain(response.domains[0]);
        }
      } catch (err) {
        console.error('Failed to load domains:', err);
      }
    };
    
    loadDomains();
  }, []);

  const handleGenerate = async () => {
    setError(null);
    
    if (username && !validateUsername(username)) {
      setError('Username must be 3-20 characters, start with a letter, and contain only lowercase letters and numbers.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await emailAPI.generateEmail(username || undefined, domain);
      onEmailGenerated(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = useCallback(() => {
    const randomUsername = generateRandomUsername();
    setUsername(randomUsername);
  }, []);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value.toLowerCase());
  }, []);

  return (
    <Container className="d-flex flex-column my-3">
      {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
      
      <FormControl 
        placeholder="Enter username (optional)" 
        className="mb-3"
        value={username}
        onChange={handleUsernameChange}
        disabled={loading}
        maxLength={APP_CONFIG.VALIDATION.USERNAME.MAX_LENGTH}
      />
      
      <InputGroup className="mb-3">
        <InputGroup.Text>@</InputGroup.Text>
        <FormSelect 
          value={domain} 
          onChange={(e) => setDomain(e.target.value)}
          disabled={loading}
        >
          {domains.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </FormSelect>
      </InputGroup>

      <Button 
        variant="primary" 
        className="mb-3 d-inline-flex gap-2 justify-content-center align-items-center"
        onClick={handleRandom}
        disabled={loading}
      >
        <FontAwesomeIcon icon={faRandom} />
        Random
      </Button>
      
      <Button 
        variant="outline-success" 
        className="fw-bold"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? <LoadingSpinner size="sm" text="Generating..." /> : 'GO'}
      </Button>
    </Container>
  );
}

export default AddressGenerate;