import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiSettings, FiHash, FiChevronDown } from "react-icons/fi";
import Modal from "react-modal";

import CreateCategorie from "./modal/CreateCategorieModal";
import UpdateChannelModal from "./modal/UpdateChannelModal";
import CreateChannelModal from "./modal/CreateChannelModal";
import DaoSettingsModal from "./modal/DaoSettingsModal";

import "../../components/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const baseURL = "http://localhost:8080";

const SidebarChannel = ({ daoId, channelId }) => {
  const [daoData, setDaoData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [createChannelModalOpen, setCreateChannelModalOpen] = useState(false);
  const [createCategorieModalOpen, setCreateCategorieModalOpen] =
    useState(false);
  const [updateChannelModalOpen, setUpdateChannelModalOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState([]);
  const [hoveringChannel, setHoveringChannel] = useState(null);
  const [channelType, setChannelType] = useState("TEXT");
  const [daoSettingsModalOpen, setDaoSettingsModalOpen] = useState(false);
  const [inputChannelName, setInputChannelName] = useState("");
  const [inputCategorieName, setInputCategorieName] = useState("");
  const [daoMenuCollapsed, setDaoMenuCollapsed] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user")).id;

  const toggleDaoMenu = () => {
    setDaoMenuCollapsed(!daoMenuCollapsed);
  };

  const toggleCategory = (categoryId) => {
    if (collapsedCategories.includes(categoryId)) {
      setCollapsedCategories(
        collapsedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setCollapsedCategories([...collapsedCategories, categoryId]);
    }
  };

  const handleChannelTypeChange = (e) => {
    setChannelType(e.target.value);
  };

  useEffect(() => {
    if (daoData && daoData.categories && daoData.categories.length > 0) {
      setSelectedCategoryId(daoData.categories[0].id);
    }
  }, [daoData]);

  const fetchDao = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const result = await axios.get(`${baseURL}/api/dao/getOne`, {
        params: {
          daoId: daoId,
          userId: userId,
        },
        headers: {
          "x-access-token": accessToken,
        },
      });
      setDaoData(result.data.dao);
      setIsOwner(result.data.dao.ownerId === userId);
    } catch (error) {
      console.error("Error fetching DAO data:", error);
    }
  };

  useEffect(() => {
    if (!daoId) {
      return;
    }

    fetchDao();
  }, [daoId]);

  const handleInviteUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `${baseURL}/api/inviteLink/create`,
        {
          daoId: daoId,
          userId: userId,
          maxTime: 86400,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      const inviteLink = response.data.inviteLink;
      navigator.clipboard.writeText(inviteLink);
      toast.success("Invitation link copied to clipboard!");
    } catch (error) {
      console.log(error);
    }
  };

  if (!daoData) {
    return <div>Loading...</div>;
  }

  const handleCreateChannel = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `${baseURL}/api/channel/create`,
        {
          daoId: daoId,
          userId: user.id,
          channelName: inputChannelName,
          channelType: channelType,
          categorieId: selectedCategoryId,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Le canal a été créé avec succès !");
        setCreateChannelModalOpen(false);
        fetchDao();
      } else {
        toast.error("Error while creating channel");
      }
    } catch (err) {
      toast.error("Erreur lors de la création du canal.");
    }
  };

  const handleCreateCategorie = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `${baseURL}/api/catergorie/create`,
        {
          daoId: daoId,
          name: inputCategorieName,
          userId: user.id,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Le canal a été créé avec succès !");
        setCreateChannelModalOpen(false);
        fetchDao();
      } else {
        toast.error("Error while creating category");
      }
    } catch (err) {
      toast.error("Error while creating category");
    }
  };

  const openModal = (modal) => {
    setDaoMenuCollapsed(true);
    modal(true);
  };

  return (
    <div className="bg-zinc-800 text-white h-screen w-64">
      <div className="flex items-center justify-between py-3 px-4">
        <h1 className="text-xl font-semibold">{daoData.name}</h1>
        <button
          className="text-gray-400 hover:text-white"
          onClick={toggleDaoMenu}
        >
          <FiChevronDown
            className={`transition-transform duration-200 ${
              !daoMenuCollapsed ? "transform -rotate-90" : ""
            }`}
          />
        </button>
      </div>

      {!daoMenuCollapsed && (
        <div className="bg-black text-white py-2 px-4 space-y-2 mt-2 rounded-md m-4 dao-menu">
          <button
            className="block w-full text-left px-2 py-1 hover:bg-zinc rounded text-blue-300"
            onClick={handleInviteUser}
          >
            Invite user
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-zinc-700 rounded"
            variant="contained"
            onClick={() => openModal(setDaoSettingsModalOpen)}
          >
            DAO settings
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-zinc-700 rounded"
            onClick={() => openModal(setCreateChannelModalOpen)}
          >
            Create channel
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-zinc-700 rounded"
            onClick={() => openModal(setCreateCategorieModalOpen)}
          >
            Create category
          </button>
          <button className="block w-full text-left px-2 py-1 hover:bg-zinc-700 rounded text-red-500">
            Leave DAO
          </button>
        </div>
      )}

      <div className="px-4">
        {daoData.channels.map((channel) =>
          !channel.categorieId ? (
            <div
              className="relative"
              onMouseEnter={() => setHoveringChannel(channel.id)}
              onMouseLeave={() => setHoveringChannel(null)}
            >
              <Link
                key={channel.id}
                to={`/dao/${daoId}/${channel.id}`}
                className={`block cursor-pointer py-2 hover:bg-zinc-600 flex items-center rounded-lg m-1 ${
                  channel.id == channelId
                    ? "bg-zinc-600 text-white"
                    : "bg-zinc-800 hover:bg-zinc text-gray-400 hover:text-gray-300"
                }`}
              >
                <FiHash className="mx-1 mt-1" />
                {channel.name}
              </Link>
              {isOwner && hoveringChannel === channel.id && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-gray-400 hover:text-white"
                  onClick={() => openModal(setUpdateChannelModalOpen)}
                >
                  <FiSettings />
                </button>
              )}
            </div>
          ) : null
        )}
      </div>

      {daoData.categories.map((category) => (
        <div key={category.id} className="px-4">
          <div
            className="flex items-center justify-between text-gray-400 py-2 hover:text-white cursor-pointer"
            onClick={() => toggleCategory(category.id)}
          >
            {category.name}
            <FiChevronDown
              className={`transition-transform duration-200 ${
                collapsedCategories.includes(category.id)
                  ? "transform -rotate-90"
                  : ""
              }`}
            />
          </div>
          {!collapsedCategories.includes(category.id) &&
            category.channels.map((channel) => (
              <div
                className="relative"
                onMouseEnter={() => setHoveringChannel(channel.id)}
                onMouseLeave={() => setHoveringChannel(null)}
              >
                <Link
                  key={channel.id}
                  to={`/dao/${daoId}/${channel.id}`}
                  className={`block cursor-pointer py-2 hover:bg-zinc-600 flex items-center rounded-lg m-1 ${
                    channel.id == channelId
                      ? "bg-zinc-600 text-white"
                      : "bg-zinc-800 hover:bg-zinc text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FiHash className="mx-1 mt-1" />
                  {channel.name}
                </Link>
                {isOwner && hoveringChannel === channel.id && (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-gray-400 hover:text-white"
                    onClick={() => openModal(setUpdateChannelModalOpen)}
                  >
                    <FiSettings />
                  </button>
                )}
              </div>
            ))}
        </div>
      ))}

      <DaoSettingsModal
        daoSettingsModalOpen={daoSettingsModalOpen}
        setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        daoData={daoData}
      />

      <CreateChannelModal
        createChannelModalOpen={createChannelModalOpen}
        setCreateChannelModalOpen={setCreateChannelModalOpen}
        channelType={channelType}
        handleChannelTypeChange={handleChannelTypeChange}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        daoData={daoData}
        inputChannelName={inputChannelName}
        setInputChannelName={setInputChannelName}
        handleCreateChannel={handleCreateChannel}
      />

      <UpdateChannelModal
        updateChannelModalOpen={updateChannelModalOpen}
        setUpdateChannelModalOpen={setUpdateChannelModalOpen}
      />

      <CreateCategorie
        createCategorieModalOpen={createCategorieModalOpen}
        setCreateCategorieModalOpen={setCreateCategorieModalOpen}
        setInputCategorieName={setInputCategorieName}
        inputCategorieName={inputCategorieName}
        handleCreateCategorie={handleCreateCategorie}
      />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default SidebarChannel;
