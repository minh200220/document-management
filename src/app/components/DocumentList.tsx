import moment from 'moment';
import { CloseButton, Col, Container, Image, Row } from 'react-bootstrap';
import documentIcon from '../../assets/document.png';
import Document from '../types/DocumentType';

type Props = {
  documents: Document[];
  handleGetDocument: (title: string, content: string) => void;
  handleDelete?: (id: string) => void;
  withTimestamp?: boolean;
  keyValue?: string;
};

const DocumentList = ({
  documents,
  handleGetDocument,
  handleDelete,
  withTimestamp = false,
  keyValue = 'id',
}: Props) => {
  return (
    <Container>
      <Row>
        {documents.map((document, index) => (
          <Col
            xs={4}
            md={3}
            lg={2}
            key={keyValue === 'id' ? document.id : index}
            className="mt-3"
          >
            <div className="d-flex flex-column">
              <div className="d-flex flex-row">
                <Image
                  height={100}
                  sizes="4"
                  src={documentIcon}
                  rounded
                  onClick={() => handleGetDocument(document.id, document.title)}
                />
                {handleDelete ? (
                  <CloseButton onClick={() => handleDelete(document.id)} />
                ) : null}
              </div>
              <div
                onClick={() => handleGetDocument(document.id, document.title)}
                className="d-inline-block text-truncate w-100"
              >
                <div>{document.title}</div>
                <div>
                  {withTimestamp ? moment(document.timestamp).fromNow() : ''}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DocumentList;
