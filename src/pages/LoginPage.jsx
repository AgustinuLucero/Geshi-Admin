import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api'; // importo la conexion al backend


const LoginPage = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');

        try{
            const response = await apiClient.post('/auth/login', {
                email: email,
                password: password
            });

            //guardo el token
            const token = response.data.session.access_token;
            localStorage.setItem('geshi-token', token);

            console.log("Login exitoso:", response.data);

            //redirijo al dashboard y con el replace evito que vuelva al login con el boton de atras
            navigate('/dashboard', { replace: true });


        }catch(err){
            console.error("Error de Login:", err);
            const msj = err.response?.data?.message || 'Error al conectar con el servidor';
            setError(msj);
        }
    };

    return(
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <h3 className="text-center mb-4">GESHI Admin</h3>
                            
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Ingresar
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;