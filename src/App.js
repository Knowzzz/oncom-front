// App.js
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Provider } from "react-redux";

import Home from "./pages/home/home";
import NotFound from "./pages/NotFound";
import Main from "./pages/main/main";
import Signup from "./pages/sign/signup";
import Pending from "./pages/main/pending";
import Block from "./pages/main/blockfriend";
import Channel from "./pages/dao/channel";
import AuthWrapper from "./components/AuthWrapper";
import FriendMessage from "./pages/message/FriendMessage";
import DaoWrapper from "./pages/dao/DaoWrapper";

import store from "./store";

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
          path="/dao/:daoId"
          element={
            <AuthWrapper>
              <DaoWrapper />
            </AuthWrapper>
          }
        />
        <Route path="/dao/:daoId/:channelId" element={<AuthWrapper>
              <Channel />
            </AuthWrapper>} />

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
      </Routes>
    </Provider>
  );
}

export default App;
