// App.js
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import Main from './pages/main/main';
import AuthWrapper from './components/AuthWrapper';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/main"
        element={
          <AuthWrapper>
            <Main />
          </AuthWrapper>
        }
      />
    </Routes>
  );
}

export default App;
