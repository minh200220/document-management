import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type Props = {
  isShow: boolean;
  handleClose: () => void;
  handleCreate: (name: string) => void;
};

const FolderModal = (props: Props) => {
  const { isShow, handleClose, handleCreate } = props;
  const [name, setName] = useState('');

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            handleCreate(name);
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FolderModal;
