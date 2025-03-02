import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { AlertToast, useAlertToast } from '../components/AlertToast';
import DocumentList from '../components/DocumentList';
import DocumentModal from '../components/DocumentModal';
import {
  clearDocument,
  clearError,
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocumentsByFolderId,
  updateDocument,
} from '../slices/documentSlice';
import { addDocToHistory } from '../slices/historySlice';
import { AppDispatch, RootState } from '../store';
import { Mode } from '../types/Mode';

const DocumentPage: React.FC = () => {
  const {
    showAlert,
    alert: alertToast,
    toggleShowAlert,
    toggleToast,
  } = useAlertToast();
  const [mode, setMode] = useState<Mode>('view');
  const [show, setShow] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { documents, document, isLoading, error } = useSelector(
    (state: RootState) => state.document
  );
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onAddDocument = () => {
    setMode('add');
    dispatch(clearDocument());
    handleShow();
  };

  const handleCreate = (title: string, content: string) => {
    if (title.trim()) {
      dispatch(createDocument({ title, content, folderId: id || '' }));
    }
  };

  const handleUpdate = (content: string) => {
    if (document) {
      dispatch(updateDocument({ id: document.id, content }));
    }
  };

  const handleGetDocument = (id: string, title: string) => {
    dispatch(getDocumentById(id));
    dispatch(addDocToHistory({ id, title }));
    setMode('view');
    handleShow();
  };

  const handleDelete = (documentId: string) => {
    dispatch(deleteDocument(documentId));
  };

  useEffect(() => {
    dispatch(getDocumentsByFolderId(id || ''));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toggleToast(error);
      dispatch(clearError());
    }
  }, [error, dispatch, toggleToast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex flex-row mt-3">
        <Button
          variant="secondary"
          onClick={() => {
            navigate('/');
          }}
        >
          Back
        </Button>
        <h2 className="me-3 ms-3">Document List</h2>
        <Button onClick={onAddDocument}>New</Button>
      </div>
      <div></div>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <DocumentList
          documents={documents}
          handleGetDocument={handleGetDocument}
          handleDelete={handleDelete}
        />
      )}
      <DocumentModal
        isShow={show}
        handleClose={handleClose}
        title={document?.title || ''}
        content={document?.content || ''}
        mode={mode}
        changeMode={(value: Mode) => setMode(value)}
        handleUpdate={handleUpdate}
        handleCreate={handleCreate}
      />
      <AlertToast
        showAlert={showAlert}
        alert={alertToast}
        toggleShowAlert={toggleShowAlert}
      />
    </div>
  );
};

export default DocumentPage;
