import {useState, useEffect} from 'react';
import {Table, Container, Card, Button, Form, Row, Col, Alert, Spinner,Modal, ListGroup} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import apiClient from '../services/api';

const ContractsPage = () =>{
    const [contracts, setContract] = useState([]);
    const [users,  setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        usuario_id: '',
        inicio: new Date(), 
        fin: new Date(),          
        modulos: ''
    });

    //estados para gestion de pdf
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [file, setFile] = useState(null);

    //estados para gesrion de actividades
    const [showActivitiesModal, setShowActivitiesModal] = useState(false);
    const [currentContractInfo, setCurrentContractInfo] = useState(null);
    const [contractActivities, setContractActivities] = useState([]);
    const [newActivityDesc, setNewActivityDesc] = useState('');

    //cargar los datos
    const fetchData = async () =>{

        try{
            const [usersRes, contractsRes] = await Promise.all([
                apiClient.get('/users'),
                apiClient.get('/contracts')
            ]);

            setUsers(usersRes.data);
            setContract(contractsRes.data);
        }catch(err){
            console.error(err);
            setError("Error al cargar datos. Verifica tu conexión.");
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    //manejo de formulario
    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(!formData.usuario_id || !formData.fin){
            return alert("Por favor selecciona un usuario y una fecha de fin.");
        }

        try{
            //preparamos los datos para enviar
            const payload = {
                usuario_id: formData.usuario_id,
                    numero_contrato: formData.numero_contrato,
                    modulos: formData.modulos,
                    //convierto las fechas a iso para supabase
                    inicio: formData.inicio, 
                    fin: formData.fin
            };

            await apiClient.post('/contracts', payload);

            alert("¡Contrato creado con éxito!");

            //recargo la tabla
            fetchData();

            //limpio los campos
            setFormData({ ...formData, numero_contrato: '', modulos: '', fin: null });

        }catch(err){
            alert("Error al crear contrato: " + (err.response?.data?.error || err.message));
        }
    };

    //subir pdf
    const handleOpenUpload = (contractId) => {
        setSelectedContractId(contractId);
        setFile(null);
        setShowUploadModal(true);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Selecciona un PDF.");

        const uploadPayload = new FormData();
        uploadPayload.append('pdfFile', file);
        uploadPayload.append('contratoId', selectedContractId);

        try {
            // llama al nuevo endpoint del controlador de contratos
            await apiClient.post('/contracts/upload-report', uploadPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("¡¡¡¡Informe final subido al contrato!!!!");
            setShowUploadModal(false);
            fetchData(); // recargar para ver el link en la tabla
        } catch (err) {
            alert("Error al subir PDF: " + (err.response?.data?.error || err.message));
        }
    };

    //gestion de actividades
    const handleOpenActivities = async (contract) => {
        setCurrentContractInfo(contract);
        setContractActivities([]);
        setShowActivitiesModal(true);
        
        try {
            const res = await apiClient.get(`/activities/contract/${contract.id}`);
            setContractActivities(res.data);
        } catch (err) {
            console.error("Error al cargar actividades:", err);
        }
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        if (!newActivityDesc.trim()) return alert("La descripción de la tarea no puede estar vacía.");

        try {
            const payload = {
                contratoId: currentContractInfo.id,
                descripcion: newActivityDesc.trim(),
            };
            
            await apiClient.post('/activities', payload);
            
            // recargar la lista de actividades en el modal
            const res = await apiClient.get(`/activities/contract/${currentContractInfo.id}`);
            setContractActivities(res.data);
            setNewActivityDesc('');
            
        } catch (err) {
            alert("Error al agregar actividad: " + (err.response?.data?.error || err.message));
        }
    };

    //renderizo

    if (loading){
        return(
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    } 

    if(error){
        return(
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }
    
    return(
        <Container fluid>
            <h3 className="mb-3">Gestion de Contratos</h3>

            {/* formulario */}
            <Card className="shadow-sm mb-4 bg-light">
                <Card.Header><strong>Nuevo Contrato</strong></Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Cliente</Form.Label>
                                    <Form.Select 
                                        value={formData.usuario_id} 
                                        onChange={(e) => setFormData({...formData, usuario_id: e.target.value})} 
                                        required
                                    >
                                        <option value="">Seleccionar Cliente</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Inicio Vigencia</Form.Label>
                                    <DatePicker selected={formData.inicio} onChange={(date) => setFormData({...formData, inicio: date})} className="form-control" dateFormat="dd/MM/yyyy" required />
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Fin Vigencia</Form.Label>
                                    <DatePicker selected={formData.fin} onChange={(date) => setFormData({...formData, fin: date})} className="form-control" dateFormat="dd/MM/yyyy" required placeholderText="Seleccione fecha" />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Módulos (Número)</Form.Label>
                                    <Form.Control 
                                        type="number"  // <-- Usar TYPE, no AS
                                        placeholder="Ej: 10" 
                                        value={formData.modulos}
                                        onChange={(e) => setFormData({...formData, modulos: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={2} className="d-flex align-items-end">
                                <Button variant="success" type="submit" className="w-100">Crear Contrato</Button>
                            </Col>
                            
                            
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* tabla del listado */}
            <Card className="shadow-sm">
                <Card.Header>Listado de Contratos</Card.Header>
                <Card.Body className="p-0">
                    <Table striped hover responsive className="m-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Vigencia</th>
                                <th>Servicios</th>
                                <th>Informe</th>
                                <th className="text-center" style={{width: '250px'}}>Gestión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map((c) => {
                                const user = users.find(u => u.id === c.usuario);
                                return (
                                    <tr key={c.id}>
                                        <td title={c.id} style={{fontFamily: 'monospace'}}>{c.id.substring(0, 8)}...</td>
                                        <td><strong>{user ? user.nombre : 'Desconocido'}</strong></td>
                                        <td>
                                            {new Date(c.inicio).toLocaleDateString()} - {new Date(c.fin).toLocaleDateString()}
                                        </td>
                                        <td>{c.modulo}</td>
                                        <td>
                                            {c.url_informe ? (
                                                <a href={c.url_informe} target="_blank" rel="noopener noreferrer" className="text-success">
                                                    PDF Subido
                                                </a>
                                            ) : (
                                                <span className="text-danger">Pendiente</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button variant="info" size="sm" onClick={() => handleOpenActivities(c)}>
                                                    Actividades
                                                </Button>
                                                <Button variant="outline-primary" size="sm" onClick={() => handleOpenUpload(c.id)}>
                                                    Subir Informe
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {contracts.length === 0 && <tr><td colSpan="6" className="text-center py-4">No hay contratos registrados.</td></tr>}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* subir pdf unico */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Subir Informe Final</Modal.Title></Modal.Header>
                <Form onSubmit={handleUploadSubmit}>
                    <Modal.Body>
                        <p className="text-muted">El PDF reemplazará cualquier informe existente para el contrato <strong>{selectedContractId?.substring(0, 8)}...</strong>.</p>
                        <Form.Group className="mb-3">
                            <Form.Label>Archivo PDF</Form.Label>
                            <Form.Control type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Subir y Guardar URL</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* gestionar actividaes */}
            <Modal show={showActivitiesModal} onHide={() => setShowActivitiesModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title>Gestión de Tareas</Modal.Title></Modal.Header>
                <Modal.Body>
                    {currentContractInfo && (
                        <>
                            <h5>Contrato: {currentContractInfo.modulo}</h5>
                            <p className="text-muted">Cliente: {users.find(u => u.id === currentContractInfo.usuario)?.nombre || 'N/A'}</p>
                            <hr />

                            {/* Formulario para agregar actividad */}
                            <Form onSubmit={handleAddActivity} className="mb-4">
                                <Row className="g-2 align-items-end">
                                    <Col xs={9}>
                                        <Form.Label>Añadir nueva actividad</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Ej: Revisión de protocolos de seguridad"
                                            value={newActivityDesc}
                                            onChange={(e) => setNewActivityDesc(e.target.value)}
                                            required
                                        />
                                    </Col>
                                    <Col xs={3}>
                                        <Button type="submit" variant="success" className="w-100">Agregar Actividad</Button>
                                    </Col>
                                </Row>
                            </Form>
                            
                            {/* Lista de actividades */}
                            <h6>Actividades del Contrato ({contractActivities.length} en total):</h6>
                            <ListGroup className="mt-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                {contractActivities.length === 0 ? (
                                    <ListGroup.Item className="text-center text-muted">Aún no hay actividades.</ListGroup.Item>
                                ) : (
                                    contractActivities.map(act => (
                                        <ListGroup.Item key={act.id} className="d-flex justify-content-between align-items-center">
                                            {act.nombre}
                                            {/* Aquí iría un botón para marcar como completada */}
                                            {act.completada ? (
                                                <span className="text-success">Completa</span>
                                            ) : (
                                                <Button variant="outline-secondary" size="sm" disabled>
                                                    Pendiente
                                                </Button>
                                            )}
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </>
                    )}
                </Modal.Body>
            </Modal>

        </Container>
    );
}

export default ContractsPage;