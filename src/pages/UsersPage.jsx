import { useState, useEffect } from 'react';
import {Table, Container, Card, Alert, Spinner, Button, Modal, Form, Row, Col} from 'react-bootstrap';
import apiClient from '../services/api';

const UsersPage = () =>{
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        cuil: '',
        password: ''
    });

    //cargar usuarios
    const fetchUsers = async ()=>{
        try{
            const response = await apiClient.get('/users');
            setUsers(response.data);
        }catch(err){
            console.error(err);
            setError("Error al cargar usuarios");
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []); //si el array esta vacio entonces se ejecuta al montar el componente


    //manejar el formulario
    const handleInputChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleCreateUser = async(e) =>{
        e.preventDefault();

        const cuilAsNumber = parseInt(formData.cuil, 10);

        if (isNaN(cuilAsNumber)) {
         return alert("Error: El CUIL debe contener solo números (sin guiones, ya que la base de datos lo espera como INT).");
        }

        try{
            //envio los datos al back
            await apiClient.post('/users',{
                nombre: formData.nombre,
                email: formData.email,
                cuil: cuilAsNumber,
                password: formData.password
            });

            alert("¡¡¡¡¡Usuario Creado!!!!!");
            setShowModal(false); 
            setFormData({ nombre: '', email: '', cuil: '', password: '' }); //limpio el formulario
            fetchUsers(); // se recarga la tabla sola

        }catch(err){
            alert("Error al crear usuario: " + (err.response?.data?.error || err.message));
        }
    };

    if(loading){
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" />
                <p>Cargando usuarios...</p>
            </Container>
        );
    }

    if(error){
        return(
            <Container className="mt-5">
                <Alert variant="danger">
                    Error: {error}
                </Alert>
            </Container>
        );
    }



    //renderizo la tabla
    return(
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h3>Gestion de Usuarios</h3>
                    <p>Lista de todos los usuarios registrados en el sistema: <strong>{users.length}</strong></p>
            
                </div>
                    <Button variant="success" onClick={() => setShowModal(true)}>
                        Nuevo Usuario
                    </Button>
            </div>
            
            <Card className="shadow-sm mt-4">
                <Card.Body className="p-0">
                    <Table striped hover responsive className="m-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>CUIL</th>
                                <th>Rol</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.nombre}</td>
                                    <td>{user.mail}</td>
                                    <td>{user.cuil}</td>
                                    <td>
                                        <span className={`badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm">Editar</Button>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                </Card.Body>
            </Card>


            {/*modal de creacion */}
            <Modal show = {showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Cliente</Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleCreateUser}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control 
                                type="text" name="nombre" required 
                                value={formData.nombre} onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" name="email" required 
                                        value={formData.email} onChange={handleInputChange} 
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CUIL</Form.Label>
                                    <Form.Control 
                                        type="text" name="cuil" required
                                        value={formData.cuil} onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" name="password" required minLength="6"
                                value={formData.password} onChange={handleInputChange} 
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default UsersPage;