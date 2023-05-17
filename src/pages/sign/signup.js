import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { JSON_RPC_URL } from "../../components/const";

const Signup = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [walletAddressPage, setWalletAddressPage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    connectWallet();
  }, []);

  const baseURL = "http://localhost:8080";

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsConnected(accounts.length > 0);
        setWalletAddressPage(accounts);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("No Ethereum provider found");
      return;
    }
  };

  const register = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Utilisez Web3Provider pour accéder au fournisseur MetaMask
      const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL);

      try {
        if (!isConnected) {
          return;
        }
        const message = await axios.post(
          `${baseURL}/api/user/generateMessage`,
          {
            wallet_address: walletAddressPage[0],
          }
        );
        if (!message) {
          return { error: "Error please try later" };
        }
        const signer = await provider.getSigner();
        const signature = await signer.signMessage(message.data.message);
        const result = await axios.post(`${baseURL}/api/user/register`, {
          pseudo: pseudo,
          wallet_address: walletAddressPage[0],
          message: message.data.message,
          signature: signature,
          messageId: message.data.messageId,
        });
        if (result.data.error) {
          setError(result.data.error);
          return console.log(result.data.error);
        }
        setError("");

        localStorage.setItem("accessToken", result.data.accessToken);
        const user = localStorage.setItem(
          "user",
          JSON.stringify(result.data.user)
        );

        dispatch(setUser(user));
        navigate("/main");
      } catch (err) {
        console.log(err);
        setError("Error");
        return err;
      }
    }
  };

  const login = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        // Utilisez Web3Provider pour accéder au fournisseur MetaMask
        const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL);

        try {
          if (!isConnected) {
            return;
          }
          const message = await axios.post(
            `${baseURL}/api/user/generateMessage`,
            {
              wallet_address: walletAddressPage[0],
            }
          );
          if (!message) {
            return { error: "Error please try later" };
          }
          const signer = await provider.getSigner();
          const signature = await signer.signMessage(message.data.message);
          const result = await axios.post(`${baseURL}/api/user/login`, {
            wallet_address: walletAddressPage[0],
            message: message.data.message,
            signature: signature,
            messageId: message.data.messageId,
          });
          if (result.data.error) {
            setError(result.data.error);
            return console.log(result.data.error);
          }
          setError("");

          localStorage.setItem("accessToken", result.data.accessToken);
          const user = localStorage.setItem(
            "user",
            JSON.stringify(result.data.user)
          );

          dispatch(setUser(user));

          navigate("/main");
        } catch (err) {
          console.log(err);
          setError("Error");
          return err;
        }
      }
    } catch (err) {
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
      <div className="flex flex-col min-h-screen bg-zinc-100 items-center justify-center">
        <h1 className="text-4xl mb-10 font-bold"> {t("signup")} </h1>
        {isConnected ? (
          <>
            <input
              type="text"
              className="border-2 border-gray-300 p-2 mb-2 rounded w-64 focus:outline-none focus:border-blue-500"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder={generateRandomPseudo()}
            />
            {error && <p className="text-s text-red-500">{error}</p>}

            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded w-64 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 mt-4"
              onClick={() => register()}
            >
              {t("signup")}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded w-64 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
        <p className="mt-4 text-gray-700">{t("already_account")}</p>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-64 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
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
