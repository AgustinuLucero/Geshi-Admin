import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner, Alert,Form, ListGroup,Button } from 'react-bootstrap';
import apiClient from '../services/api';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //estados del buscador
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);


    //busqueda
    const handleGlobalSearch = async (e) => {
        e.preventDefault();
        if(!searchTerm.trim()) return;
        setSearching(true);
        try{
            const res = await apiClient.get(`/search?q=${searchTerm}`);
            setSearchResults(res.data.results);
        }catch(err){
            alert("Error al buscar: " + err.message);
            setSearchResults({ clientes: [], contratos: [], actividades: [] });
        }finally{
            setSearching(false);
        }
    }

    //estadisticas
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                setError('Failed to load dashboard statistics.');
            }finally{
                setLoading(false);
            }
    };
        fetchStats();
    }, []);

    if(loading){
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border"/>
            </Container>
        );
    }

    if(error){
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    const totalActividades = stats?.totalActividades || 0;
    const actividadesCompletas = stats?.actividadesCompletas || 0;
    const porcentajeGlobal = totalActividades > 0 
                             ? Math.round((actividadesCompletas / totalActividades) * 100)
                             : 0;

    return (
        <Container fluid>
            <h3 className="mb-4">Panel de Control</h3>

            {/* Buscador Global (Integrado) */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Form onSubmit={handleGlobalSearch}>
                        <Row className="g-2 align-items-center">
                            <Col xs={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por Nombre de Cliente, Contrato o Descripción de Actividad..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={searching}
                                    required
                                />
                            </Col>
                            <Col xs={2}>
                                <Button type="submit" variant="primary" disabled={searching} className="w-100">
                                    {searching ? <Spinner animation="border" size="sm" /> : 'BUSCAR'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* contenido */}
            {searchResults && (
                <Card className="shadow-sm mb-4">
                    <Card.Header>Resultados de la Búsqueda</Card.Header>
                    <Card.Body>
                        <Row>
                            {/* resultados clientes */}

                            <Col md={4}>
                                <h6>Clientes ({searchResults.clientes?.length || 0})</h6>
                                <ListGroup variant="flush">
                                    {/* Agregamos '?.' y '|| []' para evitar el crash */}
                                    {(searchResults.clientes || []).map(c => (
                                        <ListGroup.Item key={c.id}>
                                            <strong>{c.nombre}</strong> <small className="text-muted">({c.cuil})</small>
                                        </ListGroup.Item>
                                    ))}
                                    {(!searchResults.clientes || searchResults.clientes.length === 0) && <ListGroup.Item className="text-muted">No encontrado.</ListGroup.Item>}
                                </ListGroup>
                            </Col>
                            
                            {/* resultados contratos */}
                            <Col md={4}>
                                <h6>Contratos ({searchResults.contratos.length})</h6>
                                <ListGroup variant="flush">
                                    {searchResults.contratos.map(c => (
                                        <ListGroup.Item key={c.id}>
                                            <strong>{c.numero_contrato}</strong><br/>
                                            <small className="text-muted">Contrato: {c.id}</small>
                                        </ListGroup.Item>
                                    ))}
                                    {searchResults.contratos.length === 0 && <ListGroup.Item className="text-muted">No encontrado.</ListGroup.Item>}
                                </ListGroup>
                            </Col>

                            {/* resultados actividades */}
                            <Col md={4}>
                                <h6>Actividades ({searchResults.actividades.length})</h6>
                                <ListGroup variant="flush">
                                    {searchResults.actividades.map(a => (
                                        <ListGroup.Item key={a.id}>
                                            <strong>{a.descripcion}</strong><br/>
                                            <small className="text-muted">Contrato: {a.Contratos?.id || 'N/A'}</small>
                                        </ListGroup.Item>
                                    ))}
                                    {searchResults.actividades.length === 0 && <ListGroup.Item className="text-muted">No encontrado.</ListGroup.Item>}
                                </ListGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}


            {/* tarjetas */}
            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="text-center h-100 border-0 shadow-sm" style={{backgroundColor: '#e3f2fd'}}>
                        <Card.Body>
                            <h6 className="text-muted">Clientes Activos</h6>
                            <h1 className="display-4 fw-bold text-primary">{stats.totalClientes}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center h-100 border-0 shadow-sm" style={{backgroundColor: '#e8f5e9'}}>
                        <Card.Body>
                            <h6 className="text-muted">Contratos Registrados</h6>
                            <h1 className="display-4 fw-bold text-success">{stats.totalContratos}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center h-100 border-0 shadow-sm" style={{backgroundColor: '#fff3e0'}}>
                        <Card.Body>
                            <h6 className="text-muted">Actividades Totales</h6>
                            <h1 className="display-4 fw-bold text-warning">{stats.totalActividades}</h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* progreso */}
            <Card className="shadow-sm">
                <Card.Header>Rendimiento</Card.Header>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={3}>
                            <h5>Cumplimiento Total</h5>
                            <p className="text-muted">
                                {stats.actividadesCompletas} de {stats.totalActividades} tareas finalizadas.
                            </p>
                        </Col>
                        <Col md={9}>
                            <ProgressBar 
                                now={stats.porcentajeGlobal} 
                                label={`${stats.porcentajeGlobal}%`} 
                                variant={stats.porcentajeGlobal > 70 ? "success" : "info"}
                                style={{ height: '30px', fontSize: '1.2rem' }}
                                animated
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DashboardPage;