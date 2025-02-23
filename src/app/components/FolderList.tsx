import { Col, Container, Row, Image, CloseButton } from 'react-bootstrap';
import Folder from '../types/FolderType';
import folderIcon from '../../assets/folder.png';
import { NavigateFunction } from 'react-router';

type Props = {
  folders: Folder[];
  handleDeleteFolder: (id: string) => void;
  navigate: NavigateFunction;
};

const FolderList = ({ folders, navigate, handleDeleteFolder }: Props) => {
  return (
    <Container>
      <Row>
        {folders.map((folder, index) => (
          <Col xs={4} md={3} lg={2} key={folder.id} className="mt-3">
            <div className="d-flex flex-column">
              <div className="d-flex flex-row">
                <Image
                  height={100}
                  sizes="4"
                  src={folderIcon}
                  rounded
                  onClick={() => {
                    navigate(`/folder/${folder.id}`);
                  }}
                />

                <CloseButton onClick={() => handleDeleteFolder(folder.id)} />
              </div>
              <div
                onClick={() => {
                  navigate(`/folder/${folder.id}`);
                }}
                className="d-inline-block text-truncate w-100"
              >
                {folder.name}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FolderList;
