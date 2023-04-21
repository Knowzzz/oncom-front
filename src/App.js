// App.js
import "./App.css";
import { Form, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Provider } from 'react-redux';

import Home from "./pages/home/home";
import NotFound from "./pages/NotFound";
import Main from "./pages/main/main";
import Signup from "./pages/sign/signup";
import Pending from "./pages/main/pending";
import Block from "./pages/main/blockfriend";
import AuthWrapper from "./components/AuthWrapper";
import FriendMessage from "./pages/message/FriendMessage";
import Contact from "./pages/contact/contact";
import ContactForm from "./pages/contactform/contactform";

import store from './store';
import { CO } from "country-flag-icons/react/3x2";

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
        <Route
          path="/friend/message/:friendId"
          element={
            <AuthWrapper>
              <FriendMessage />
            </AuthWrapper>
          }
        />
        <Route
          path="/main/friend/pending"
          element={
            <AuthWrapper>
              <Pending />
            </AuthWrapper>
          }
        />
        <Route
          path="/main/friend/blocked"
          element={
            <AuthWrapper>
              <Block />
            </AuthWrapper>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <Home
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              modalContent={modalContent}
              setModalContent={setModalContent}
            />
          }
        />
        <Route path="*" element={<NotFound />} />




        <Route path="/contact"
          element=
          {<Contact />} />

        <Route path="/contact-form"
          element=
          {< ContactForm />} />
      </Routes>

    </Provider >

  );
}

export default App;
