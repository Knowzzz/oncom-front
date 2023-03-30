// AuthWrapper.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function isAuthenticated() {
  // Vérifiez si l'utilisateur est connecté, par exemple en vérifiant l'existence d'un accessToken
  // Pour cet exemple, nous renvoyons simplement true ou false, mais vous devez implémenter la logique d'authentification appropriée
  const accessToken = localStorage.getItem('accessToken');
  return true;
}

function AuthWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, []);

  return isAuthenticated() ? children : null;
}

export default AuthWrapper;
