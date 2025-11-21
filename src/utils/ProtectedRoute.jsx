import {Navigate, Outlet} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
    const isAuthenticated = useAuth();

    //si no esta logueado va al login
    if(!isAuthenticated){
        return <Navigate to= "/login" replace />;
    }

    //si esta logueado
    return <Outlet/>
}

export default ProtectedRoute;