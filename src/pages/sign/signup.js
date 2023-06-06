import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import axios from "axios";
import { useAccount, useConnect } from "wagmi";
import { signMessage } from "@wagmi/core";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../components/const";
import Modal from "react-modal";
import { Transition, Dialog } from "@headlessui/react";

const Signup = () => {
  const [pseudo, setPseudo] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const register = async () => {
    try {
      if (!isConnected) {
        return;
      }
      const message = await axios.post(`${baseURL}/api/user/generateMessage`, {
        wallet_address: address,
      });
      if (!message) {
        return { error: "Error please try later" };
      }

      const signature = await signMessage({
        message: message.data.message,
      });

      const result = await axios.post(`${baseURL}/api/user/register`, {
        pseudo: pseudo,
        wallet_address: address,
        message: message.data.message,
        signature: signature,
        messageId: message.data.messageId,
      });
      if (result.data.error) {
        toast.error(result.data.error);
        return;
      }

      localStorage.setItem("accessToken", result.data.accessToken);
      const user = localStorage.setItem(
        "user",
        JSON.stringify(result.data.user)
      );

      dispatch(setUser(user));
      navigate("/main");
    } catch (err) {
      toast.error(err);
      return err;
    }
  };

  const login = async () => {
    try {
      if (!isConnected) {
        return;
      }
      const message = await axios.post(`${baseURL}/api/user/generateMessage`, {
        wallet_address: address,
      });
      if (!message) {
        return { error: "Error please try later" };
      }

      const signature = await signMessage({
        message: message.data.message,
      });

      const result = await axios.post(`${baseURL}/api/user/login`, {
        wallet_address: address,
        message: message.data.message,
        signature: signature,
        messageId: message.data.messageId,
      });
      if (result.data.error) {
        toast.error(result.data.error);
        return;
      }

      localStorage.setItem("accessToken", result.data.accessToken);
      const user = localStorage.setItem(
        "user",
        JSON.stringify(result.data.user)
      );

      dispatch(setUser(user));

      navigate("/main");
    } catch (err) {
      toast.error("Cannot sign in");
      return err;
    }
  };

  const generateRandomPseudo = () => {
    const adjectives = [
      "Cool",
      "Awesome",
      "Amazing",
      "Creative",
      "Brilliant",
      "Charming",
      "Energetic",
      "Fearless",
      "Innovative",
      "Resourceful",
      "Dynamic",
      "Passionate",
      "Ambitious",
      "Determined",
      "Inspiring",
      "Adventurous",
      "Reliable",
      "Optimistic",
      "Spirited",
      "Persistent",
    ];

    const nouns = [
      "User",
      "Person",
      "Developer",
      "Designer",
      "Coder",
      "Artist",
      "Gamer",
      "Enthusiast",
      "Thinker",
      "Visionary",
      "Explorer",
      "Inventor",
      "Strategist",
      "Pioneer",
      "Collaborator",
      "Architect",
      "Analyst",
      "Mentor",
      "Storyteller",
      "Trailblazer",
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}${randomNoun}`;
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="bottom-right" />
      <div className="flex flex-col min-h-screen bg-zinc-100 items-center justify-center bg-zinc-800">
        <h1 className="text-4xl mb-10 font-bold text-zinc-300"> {t("signup")} </h1>
        {isConnected ? (
          <>
            <input
              type="text"
              className="border-2 border-gray-300 p-2 mb-2 rounded w-64 focus:outline-none focus:border-blue-500"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder={generateRandomPseudo()}
            />
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded w-64 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 mt-4"
              onClick={() => register()}
            >
              {t("signup")}
            </button>
          </>
        ) : (
          <div>
            <button
              type="button"
              className="bg-zinc-400 text-white px-4 py-2 rounded w-64 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
              onClick={openModal}
            >
              Connect Wallet
            </button>
            <Transition appear show={modalIsOpen} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
              >
                <div className="px-4 min-h-screen text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                  </Transition.Child>

                  <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-white"
                      >
                        Connect Wallet
                      </Dialog.Title>
                      <div className="mt-4">
                        {connectors.map((connector) => (
                          <button
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            disabled={!connector.ready}
                            className="block w-full px-4 py-2 text-sm font-medium text-left text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {connector.name}
                            {isLoading &&
                              pendingConnector?.id === connector.id &&
                              " (connecting)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          </div>
        )}
        <p className="mt-4 text-zinc-300">{t("already_account")}</p>
        <button
          type="button"
          className="bg-zinc-500 text-white px-4 py-2 rounded mt-2 w-64 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => login()}
        >
          {t("signin")}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
