import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ContractsPage from './pages/ContractsPage';
import DashboardPage from './pages/DashboardPage';


//esto es de prueba por ahora
//const Login = () => <h2>Página de Login (ToDo)</h2>;
//const Dashboard = () => <h2>Bienvenido al Dashboard</h2>;
//const Users = () => <h2>Gestión de Usuarios (ToDo)</h2>;

function App() {
  

  return (
    <>
      <Router>
      <Routes>
        {/* esta es la ruta publica */}
        <Route path="/login" element={<LoginPage />} />

        {/* esta  las privadas */}
        <Route element={<ProtectedRoute />}>
            {/* Todas estas usan el AdminLayout (Sidebar) */}
            <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/contracts" element={<ContractsPage/>} />
                <Route path="/activities" element={<h2>Actividades</h2>} />
            </Route>
        </Route>

        {/* redireccion por defecto*/}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
