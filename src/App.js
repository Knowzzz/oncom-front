// App.js
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Provider } from "react-redux";

import { createConfig, configureChains, WagmiConfig,  } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

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
import JoinDaoPage from "./pages/JoinDao";

import store from "./store";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  return (
    <WagmiConfig config={config}>
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
          <Route
            path="/invite/:inviteToken"
            element={
              <AuthWrapper>
                <JoinDaoPage />
              </AuthWrapper>
            }
          />
          <Route
            path="/dao/:daoId/:channelId"
            element={
              <AuthWrapper>
                <Channel />
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
        </Routes>
      </Provider>
    </WagmiConfig>
  );
}

export default App;
