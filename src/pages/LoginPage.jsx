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
            
            {/* Franja Superior Verde (Simulando el gradiente de la imagen) */}
            <div className="top-green-strip"></div>

            {/* Contenedor para el logo centrado (ajustado para la posición de la imagen) */}
            <div className="logo-container">
                <div className="logo-card">
                    {/* En la imagen se ve un logo diferente, pero usamos el importado */}
                    <img src={logoGeshi} alt="Logo del Sistema" className="system-logo" />
                    <span className="logo-caption">SOLUCIONES PARA EMPRESAS</span>
                </div>
            </div>

            {/* Contenedor para la tarjeta de login, centrado verticalmente con la ayuda del flexbox del div principal */}
            <Container className="login-form-wrapper" >
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={4}>
                        {/* Usamos Card de Bootstrap pero le aplicamos clases de estilo de la imagen */}
                        <Card className="shadow login-card-mimic">
                            <Card.Body className="p-4">
                                <h3 className="text-center mb-4 login-title-mimic">Ingreso al Sistema</h3>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        {/* Form.Label se quita para imitar el diseño, pero mantenemos el Form.Group */}
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Usuario" // Placeholder para imitar el texto dentro del input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        {/* Form.Label se quita para imitar el diseño */}
                                        <Form.Control 
                                            type="password" 
                                            placeholder="Contraseña" // Placeholder para imitar el texto dentro del input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    {/* Contenedor para alinear el botón a la derecha */}
                                    <div className="d-flex justify-content-end">
                                        {/* Aplicamos una clase custom al botón para el color y estilo */}
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