// App.js
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Provider } from 'react-redux';

import Home from "./pages/home/home";
import Main from "./pages/main/main";
import Signup from "./pages/sign/signup";
import AuthWrapper from "./components/AuthWrapper";

import store from './store';

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  return (
    <Provider store={store}>
    <Routes>
      <Route
        path="/main"
        element={
          <AuthWrapper>
            <Main />
          </AuthWrapper>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <Home
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            modalContent={modalContent}
            setModalContent={setModalContent}
          />
        }
      />
    </Routes>
    </Provider>
  );
}

export default App;
