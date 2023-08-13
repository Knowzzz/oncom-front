import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  AiOutlinePlusCircle,
  AiOutlineUser,
  AiOutlineLock,
} from "react-icons/ai";
import Modal from "react-modal";
import "./style.css";

const baseURL = "http://localhost:8080";

Modal.setAppElement("#root");

const SidebarServers = () => {
  const [servers, setServers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [daoLogo, setDaoLogo] = useState(null);
  const [daoName, setDaoName] = useState("");
  const navigate = useNavigate();
  const fileInputRef = React.createRef();

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
        setServers(result.data.daos);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    fetchServers();
  }, []);

  const handleCreateDao = async () => {
    if (!daoName) {
      alert("Please enter a DAO name.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("daoName", daoName);

      const response = await fetch(daoLogo);
      const blob = await response.blob();
      formData.append("avatar", blob, "dao-logo.png");

      const result = await axios.post(`${baseURL}/api/dao/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": accessToken,
        },
      });
      navigate(`/dao/${result.dao.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setDaoLogo(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setDaoLogo(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDaoNameChange = (event) => {
    setDaoName(event.target.value);
  };

  return (
    <div className="bg-zinc-900 w-16 flex flex-col h-screen items-center py-4 overflow-y-auto custom-scrollbar">
      <Link to="/">
        <button className="group bg-gray-500 hover:bg-green-500 text-white w-12 h-12 rounded-full hover:rounded-[14px] flex items-center justify-center transition-colors duration-500 transition-border duration-500">
          <AiOutlineUser className="text-green-500 group-hover:text-gray-500 text-3xl transition-colors duration-500" />
        </button>
      </Link>
      {servers &&
        servers.map((server, index) => (
          <Link key={index} to={`/dao/${server.id}`}>
            <img
              src={`${baseURL}/static${server.avatar}`}
              alt={server.name}
              className="w-12 h-12 rounded-full my-4 hover:rounded-[14px]"
            />
          </Link>
        ))}

      <button
        className="group bg-gray-500 hover:bg-green-500 text-white w-12 h-12 rounded-full hover:rounded-[14px] flex items-center justify-center transition-colors duration-500 transition-border-radius duration-500"
        onClick={() => setShowModal(true)}
      >
        <AiOutlinePlusCircle className="text-green-500 group-hover:text-gray-500 text-3xl transition-colors duration-500" />
      </button>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-zinc-900 w-1/4 mx-auto mt-16 p-6 rounded-lg flex flex-col items-center"
        overlayClassName="fixed inset-0 flex items-center justify-center z-50 bgblack bg-opacity-75"
      >
        <h2 className="text-white text-2xl mb-2">Give a name for your DAO!</h2>
        <p className="text-gray-400 text-sm mb-6">
          Create and manage your decentralized organization with ease.
        </p>
        <div className="w-full mb-4">
          {daoLogo ? (
            <img
              src={daoLogo}
              alt="DAO Logo"
              className="w-24 h-24 mx-auto border-2 border-gray-400 rounded-full cursor-pointer"
              onClick={handleImageClick}
            />
          ) : (
            <div
              className="w-24 h-24 mx-auto border-2 border-gray-400 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleImageClick}
            >
              <span className="text-gray-400">Your DAO Logo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            name="avatar"
          />
        </div>
        <label htmlFor="daoName" className="text-white text-lg mb-2">
          DAO Name
        </label>
        <input
          id="daoName"
          type="text"
          value={daoName}
          onChange={handleDaoNameChange}
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
          <AiOutlineLock className="text-green-500 animate-pulse text-2xl" />
        </div>
      </Modal>
    </div>
  );
};

export default SidebarServers;
