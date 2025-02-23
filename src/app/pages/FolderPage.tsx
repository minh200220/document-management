import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  createFolder,
  getFolders,
  deleteFolder,
  clearError,
} from '../slices/folderSlice';
import { clearDocuments, searchDoc } from '../slices/searchDocSlice';
import FolderModal from '../components/FolderModal';
import FolderList from '../components/FolderList';
import { Button } from 'react-bootstrap';
import { ErrorToast, useErrorToast } from '../components/AlertToast';
import DocumentList from '../components/DocumentList';
import { getDocumentById, updateDocument } from '../slices/documentSlice';
import { addDocToHistory } from '../slices/historySlice';
import { Mode } from '../types/Mode';
import DocumentModal from '../components/DocumentModal';

const FolderPage: React.FC = () => {
  const {
    showError,
    error: errorToast,
    toggleShowError,
    toggleToast,
  } = useErrorToast();
  const dispatch = useDispatch<AppDispatch>();
  const { folders, isLoading, error } = useSelector(
    (state: RootState) => state.folder
  );
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [mode, setMode] = useState<Mode>('view');
  const [showDoc, setShowDoc] = useState(false);

  const handleCloseDoc = () => setShowDoc(false);
  const handleShowDoc = () => setShowDoc(true);

  const { document } = useSelector((state: RootState) => state.document);
  const { documents, isLoading: isHistoryLoading } = useSelector(
    (state: RootState) => state.searchDoc
  );

  const [query, setQuery] = useState('');

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
          <ErrorToast
            showError={showError}
            error={errorToast}
            toggleShowError={toggleShowError}
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
