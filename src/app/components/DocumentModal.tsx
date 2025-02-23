import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Markdown from 'react-markdown';
import { Mode } from '../types/Mode';

type Props = {
  isShow: boolean;
  handleClose: () => void;
  handleCreate?: (title: string, content: string) => void;
  handleUpdate: (content: string) => void;
  changeMode: (value: Mode) => void;
  title: string;
  content: string;
  mode: Mode;
};

const DocumentModal = (props: Props) => {
  const {
    isShow,
    handleClose,
    title: initTitle,
    content: initContent,
    mode,
    changeMode,
    handleCreate,
    handleUpdate,
  } = props;
  const [title, setTitle] = useState(initTitle);
  const [content, setContent] = useState(initContent);

  useEffect(() => {
    if (mode === 'add') {
      setTitle('');
      setContent('');
    }
  }, [mode]);

  useEffect(() => {
    setTitle(initTitle);
    setContent(initContent);
  }, [initTitle, initContent]);

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add'
            ? 'New Document'
            : mode === 'edit'
            ? 'Edit: ' + title
            : 'View: ' + title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode === 'view' ? (
          <div>
            <Markdown>{content}</Markdown>
          </div>
        ) : (
          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={mode === 'edit'}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter document content in markdown text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {mode === 'edit' ? (
          <Button variant="secondary" onClick={() => changeMode('view')}>
            Cancle
          </Button>
        ) : null}
        <Button
          variant="primary"
          disabled={!title || !content}
          onClick={() => {
            if (mode === 'edit') {
              handleUpdate(content);
              changeMode('view');
            } else if (mode === 'add') {
              if (handleCreate) {
                handleCreate(title, content);
                changeMode('view');
              }
            } else {
              changeMode('edit');
            }
          }}
        >
          {mode === 'view' ? 'Edit' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentModal;
