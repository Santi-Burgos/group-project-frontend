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
      if (data) {
        setAuthorized(true);
        setLoading(false)
      } else {
        setAuthorized(false);
        setLoading(false);

        setTimeout(() => {
          navigate('/');
        }, 3000); // redirige tras 3 segundos
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Cargando...</p>;

  if (!authorized) return <h1>NO TOKEN PROVIDED, REDIRECTING TO LOGIN...</h1>;

  return children;
};

export default ProtectedRoute;
