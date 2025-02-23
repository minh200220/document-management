import { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const useAlertToast = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState('');

  const toggleToast = (alertMessage: string) => {
    setAlert(alertMessage);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return {
    showAlert,
    alert,
    toggleShowAlert: () => setShowAlert(false),
    toggleToast,
  };
};

type Props = {
  alert: string;
  showAlert: boolean;
  toggleShowAlert: () => void;
};

const AlertToast = ({ showAlert, alert, toggleShowAlert }: Props) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
      <Toast bg="info" show={showAlert} onClose={toggleShowAlert}>
        <Toast.Header>
          <strong className="me-auto">Alert</strong>
        </Toast.Header>
        <Toast.Body>{alert}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export { AlertToast, useAlertToast };
