import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api'; // importo la conexion al backend
import '../styles/LoginPage.css'; 
import logoGeshi from '../assets/LogoGESHI.png'

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
        <div className="login-page-container">

        <div className="top-green-strip"></div>

        {/* contenedor para el logo centrado*/}
         <div className="logo-container">
            <div className="logo-card">

                    <img src={logoGeshi} alt="Logo del Sistema" className="system-logo" />
                <span className="logo-caption">SOLUCIONES PARA EMPRESAS</span>
            </div>
         </div>


            <Container className="login-form-wrapper" >
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={4}>
                        <Card className="shadow login-card-mimic">
                            <Card.Body className="p-4">
                                <h3 className="text-center mb-4 login-title-mimic">Ingreso al Sistema</h3>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">

                                        <Form.Control 
                                            type="email" 
                                            placeholder="Usuario" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">

                                        <Form.Control 
                                            type="password" 
                                            placeholder="Contraseña" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>


                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" className="btn-ingresar-mimic">
                                            Ingresar
                                        </Button>
                                    </div>

                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="text-center mt-4 text-muted small">
                            &copy; 2025 GESHI. Todos los derechos reservados.
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginPage;