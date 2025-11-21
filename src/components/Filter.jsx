import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const Filter = ({onSearch}) =>{
    const handleSearch = (e) =>{
        e.preventDefault();
        if(onSearch) onSearch();
    }

    return(
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Form onSubmit={handleSearch}>
                    <Row className="align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Fecha Desde</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Cliente</Form.Label>
                                <Form.Select>
                                    <option value="">- Todos -</option>
                                    {/* aca vamos a cargar los clientes*/}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                             <Button variant="success" type="submit" className="w-100">
                                BUSCAR
                             </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}