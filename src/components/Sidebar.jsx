import {Nav} from 'react-bootstrap';
import{Link} from 'react-router-dom'; // esto es para no recargar la pagina
import logoGeshi from '../assets/LogoGESHI.png'

const Sidebar = () =>{
    const handleLogout = () =>{
        localStorage.removeItem('geshi-token');
        window.location.href = '/login';
    }

    return(
        <div className ="d-flex flex-column p-3 text-white bg-dark" style={{height: '100vh'}}>
            <img
                src={logoGeshi}
                alt='Geshi Admin'
                className="img-fluid"
                style={{ maxWidth: '150px', maxHeight: '50px' }}
            />
            <Nav className="flex-column gap-2">
                
                <Nav.Link as={Link} to="/dashboard" className="text-white">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/users" className="text-white">Usuarios</Nav.Link>
                <Nav.Link as={Link} to="/contracts" className="text-white">Contratos</Nav.Link>
                <Nav.Link as={Link} to="/activities" className="text-white">Actividades</Nav.Link>
                
                <div className="mt-auto">
                    <hr />
                    <Nav.Link onClick={handleLogout} className="text-danger">Cerrar Sesion</Nav.Link>
                </div>
            </Nav>
        </div>
    );
};

export default Sidebar;