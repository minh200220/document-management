import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocumentList from '../components/DocumentList';
import DocumentModal from '../components/DocumentModal';
import { getDocumentById, updateDocument } from '../slices/documentSlice';
import { addDocToHistory, getDocHistory } from '../slices/historySlice';
import { AppDispatch, RootState } from '../store';
import { Mode } from '../types/Mode';

function RecentDocument() {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, isLoading, error } = useSelector(
    (state: RootState) => state.history
  );
  const { document } = useSelector((state: RootState) => state.document);
  const [mode, setMode] = useState<Mode>('view');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUpdate = (content: string) => {
    if (document) {
      dispatch(updateDocument({ id: document.id, content }));
    }
  };

  const handleGetDocument = (id: string, title: string) => {
    dispatch(getDocumentById(id));
    dispatch(addDocToHistory({ id, title }));
    handleShow();
    setMode('view');
  };

  useEffect(() => {
    dispatch(getDocHistory());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Recent View Document</h2>

      {documents.length === 0 ? (
        <p>No recent documents found.</p>
      ) : (
        <DocumentList
          keyValue="timestamp"
          documents={documents}
          handleGetDocument={handleGetDocument}
          withTimestamp={true}
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
      />
    </div>
  );
}

export default RecentDocument;
