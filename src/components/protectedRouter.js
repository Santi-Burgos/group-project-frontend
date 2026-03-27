import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { main } from '../services/servicesMain'; 

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {

      const data = await main();
      console.log('dataMain', data)
    
      if (data) {
        setAuthorized(true);
        setLoading(false)
      } else {
        setAuthorized(false);
        setLoading(false);

        setTimeout(() => {
          navigate('/');
        }, 3000); 
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Verificando sesión...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-card">
          <h1>Sesión no válida</h1>
          <p>No se ha proporcionado un token de acceso o tu sesión ha expirado.</p>
          <div className="redirect-timer">Redirigiendo al login...</div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
