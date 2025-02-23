import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AlertToast, useAlertToast } from '../components/AlertToast';
import DocumentList from '../components/DocumentList';
import DocumentModal from '../components/DocumentModal';
import FolderList from '../components/FolderList';
import FolderModal from '../components/FolderModal';
import { getDocumentById, updateDocument } from '../slices/documentSlice';
import {
  clearError,
  createFolder,
  deleteFolder,
  getFolders,
} from '../slices/folderSlice';
import { addDocToHistory } from '../slices/historySlice';
import { clearDocuments, searchDoc } from '../slices/searchDocSlice';
import { AppDispatch, RootState } from '../store';
import { Mode } from '../types/Mode';

const FolderPage: React.FC = () => {
  const {
    showAlert,
    alert: alertToast,
    toggleShowAlert,
    toggleToast,
  } = useAlertToast();
  const { folders, isLoading, error } = useSelector(
    (state: RootState) => state.folder
  );
  const { document } = useSelector((state: RootState) => state.document);
  const { documents, isLoading: isHistoryLoading } = useSelector(
    (state: RootState) => state.searchDoc
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [mode, setMode] = useState<Mode>('view');
  const [showDoc, setShowDoc] = useState(false);
  const [query, setQuery] = useState('');

  const handleCloseDoc = () => setShowDoc(false);
  const handleShowDoc = () => setShowDoc(true);

  const handleCreateFolder = (name: string) => {
    dispatch(createFolder(name));
    handleClose();
  };

  const handleGetDocument = (id: string, title: string) => {
    dispatch(getDocumentById(id));
    dispatch(addDocToHistory({ id, title }));
    setMode('view');
    handleShowDoc();
  };

  const handleDeleteFolder = (folderId: string) => {
    dispatch(deleteFolder(folderId));
  };

  const handleUpdate = (content: string) => {
    if (document) {
      dispatch(updateDocument({ id: document.id, content }));
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchDoc({ keyword: query }));
      } else {
        dispatch(clearDocuments());
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, dispatch]);

  useEffect(() => {
    dispatch(getFolders());
  }, [dispatch]);

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
      <div className="d-flex flex-column align-items-center justify-content-center mb-3 mt-3">
        <input
          type="text"
          className="form-control w-50 text-center"
          placeholder="Type to search for documents"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isHistoryLoading ? (
        <p>Loading...</p>
      ) : documents.length === 0 && query ? (
        <p>No documents found.</p>
      ) : (
        <DocumentList
          documents={documents}
          handleGetDocument={handleGetDocument}
        />
      )}

      <DocumentModal
        isShow={showDoc}
        handleClose={handleCloseDoc}
        title={document?.title || 'test'}
        content={document?.content || 'test'}
        mode={mode}
        changeMode={(value: Mode) => setMode(value)}
        handleUpdate={handleUpdate}
      />

      <div>
        <div className="d-flex flex-row mt-3">
          <h2>Folder List</h2>
          <AlertToast
            showAlert={showAlert}
            alert={alertToast}
            toggleShowAlert={toggleShowAlert}
          />
          <Button onClick={handleShow} disabled={isLoading} className="ms-3">
            Create Folder
          </Button>
        </div>
        {folders.length === 0 ? (
          <p>No folders found.</p>
        ) : (
          <FolderList
            folders={folders}
            handleDeleteFolder={handleDeleteFolder}
            navigate={navigate}
          />
        )}
        <FolderModal
          isShow={show}
          handleClose={handleClose}
          handleCreate={handleCreateFolder}
        />
      </div>
    </div>
  );
};

export default FolderPage;
