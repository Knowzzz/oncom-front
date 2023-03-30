// Home.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';


function isAuthenticated() {
  // Vérifiez si l'utilisateur est connecté, par exemple en vérifiant l'existence d'un accessToken
  // Pour cet exemple, nous renvoyons simplement true ou false, mais vous devez implémenter la logique d'authentification appropriée
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return false;
  return false;
}

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/main');
    }
  }, []);

  return (
    <div className="page-container">
      <div className="triangle"></div>
      <div className="reflection"></div>
      {/* Le reste de votre contenu ici */}
    </div>
  );
}

export default Home;
