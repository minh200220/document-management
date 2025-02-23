import { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const useErrorToast = () => {
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const toggleToast = (errorMessage: string) => {
    setError(errorMessage);
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  return {
    showError,
    error,
    toggleShowError: () => setShowError(false),
    toggleToast,
  };
};

type Props = {
  error: string;
  showError: boolean;
  toggleShowError: () => void;
};

const ErrorToast = ({ showError, error, toggleShowError }: Props) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
      <Toast bg="info" show={showError} onClose={toggleShowError}>
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export { ErrorToast, useErrorToast };
