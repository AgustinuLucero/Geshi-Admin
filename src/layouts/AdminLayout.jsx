import {Container, Row, Col} from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import {Outlet} from 'react-router-dom'; //esto renderiza la pagina

const AdminLayout = () => {
    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                {/* columna sidebar fija */}
                <Col xs={2} className="bg-dark min-vh-100">
                    <Sidebar />
                </Col>
                
                {/* columna con contenido variable*/}
                <Col xs={10} className="p-4 bg-light">
                    {/* renderiza users, dashboard, etc*/}
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLayout;