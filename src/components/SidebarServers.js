import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AiOutlinePlusCircle,
  AiOutlineUser,
  AiOutlineLock,
} from "react-icons/ai";
import Modal from "react-modal";

const baseURL = "http://localhost:8080";

Modal.setAppElement("#root");

const SidebarServers = () => {
  const [servers, setServers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServers = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const result = await axios.get(`${baseURL}/api/dao/getAllForUser`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setServers(result.data);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    fetchServers();
  }, []);

  const handleCreateDao = () => {
    console.log("Create your DAO");
  };

  return (
    <div className="bg-gray-900 w-16 flex flex-col items-center py-4">
      {servers.map((server) => (
        <img
          key={server.id}
          src={server.logo}
          alt={server.name}
          className="rounded-full w-12 h-12 mb-4"
        />
      ))}
      <button
        className="group bg-gray-500 hover:bg-green-500 text-white w-10 h-10 rounded-full hover:rounded-[14px] flex items-center justify-center transition-colors duration-500 transition-border-radius duration-500"
        onClick={() => setShowModal(true)}
      >
        <AiOutlinePlusCircle className="text-green-500 group-hover:text-gray-500 text-2xl transition-colors duration-500" />
      </button>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-gray-900 w-1/4 mx-auto mt-16 p-6 rounded-lg flex flex-col items-center"
        overlayClassName="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      >
        <h2 className="text-white text-xl mb-1">Give a name for your DAO!</h2>
        <p className="text-gray-400 text-sm mb-4">
          Choose a unique and meaningful name for your DAO.
        </p>
        <input
          id="daoName"
          type="text"
          placeholder="MySuperDAO"
          className="w-full p-2 mb-4 border border-gray-400 rounded-lg focus:outline-none focus:border-green-500"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={handleCreateDao}
        >
          Create your DAO
        </button>
        <div className="flex space-x-4">
          <AiOutlineUser className="text-green-500 animate-pulse text-2xl" />
          <AiOutlineLock className="text-green 500 animate-pulse text-2xl" />
        </div>
      </Modal>
    </div>
  );
};

export default SidebarServers;
