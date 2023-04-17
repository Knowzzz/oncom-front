import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiSettings,
  FiHash,
  FiSpeaker,
  FiChevronDown,
} from "react-icons/fi";
import Modal from "react-modal";
import "./style.css";

Modal.setAppElement("#root");

const baseURL = "http://localhost:8080";

const SidebarChannel = ({ daoId, channelId }) => {
  const [daoData, setDaoData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [createChannelModalOpen, setCreateChannelModalOpen] = useState(false);
  const [updateChannelModalOpen, setUpdateChannelModalOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState([]);
  const [hoveringChannel, setHoveringChannel] = useState(null);
  const [channelType, setChannelType] = useState("text");
  const [daoMenuCollapsed, setDaoMenuCollapsed] = useState(true);

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

  const customRadioStyle = `
  .custom-radio::-webkit-radio {
    width: 20px;
    height: 20px;
  }

  .custom-radio::-moz-radio {
    width: 20px;
    height: 20px;
  }

  .custom-radio::before {
    width: 20px;
    height: 20px;
  }
`;

  const handleChannelTypeChange = (e) => {
    setChannelType(e.target.value);
  };

  useEffect(() => {
    if (!daoId) {
      return;
    }

    async function fetchDao() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = JSON.parse(localStorage.getItem("user")).id;

        const result = await axios.get(`${baseURL}/api/dao/getOne`, {
          params: {
            daoId: daoId,
            userId: userId,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        console.log(result.data);

        setDaoData(result.data.dao);
        setIsOwner(result.data.dao.ownerId === userId);
      } catch (error) {
        console.error("Error fetching DAO data:", error);
      }
    }

    fetchDao();
  }, [daoId]);

  if (!daoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 text-white h-screen w-64">
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
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded text-blue-300">
            Invite user
          </button>
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            DAO settings
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            onClick={() => setCreateChannelModalOpen(true)} // Ajoutez cette ligne pour ouvrir le modal lors du clic
          >
            Create channel
          </button>
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Create category
          </button>
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded text-red-500">
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
                to={`/dao/${daoId}/channel/${channel.id}`}
                className={`block cursor-pointer py-2 hover:bg-gray-700 flex items-center rounded-lg ${
                  channel.id === channelId ? "bg-gray-700" : ""
                }`}
              >
                <FiHash className="mr-1" />
                {channel.name}
              </Link>
              {isOwner && hoveringChannel === channel.id && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-gray-400 hover:text-white"
                  onClick={() => setUpdateChannelModalOpen(true)}
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
                  to={`/dao/${daoId}/categorie/${category.id}/channel/${channel.id}`}
                  className={`block cursor-pointer py-2 hover:bg-gray-700 flex items-center rounded-lg ${
                    channel.id === channelId ? "bg-gray-700" : ""
                  }`}
                >
                  <FiHash className="mr-1" />
                  {channel.name}
                </Link>
                {isOwner && hoveringChannel === channel.id && (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-gray-400 hover:text-white"
                    onClick={() => setUpdateChannelModalOpen(true)}
                  >
                    <FiSettings />
                  </button>
                )}
              </div>
            ))}
        </div>
      ))}
      <Modal
        isOpen={createChannelModalOpen}
        onRequestClose={() => setCreateChannelModalOpen(false)}
        contentLabel="Create Channel Modal"
        className="m-auto w-1/3 p-6 bg-gray-800 text-white border border-gray-700 rounded-md"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
        closeTimeoutMS={500}
      >
        <style>{customRadioStyle}</style>
        <h2 className="mb-4">Create Channel</h2>
        <div className="mb-4">
          <div className="grid gap-4">
            {["text", "vocal"].map((type) => (
              <label
                key={type}
                className="flex p-4 border border-gray-700 rounded hover:border-white cursor-pointer"
              >
                {type === "text" ? (
                  <FiHash size={24} />
                ) : (
                  <FiSpeaker size={24} />
                )}
                <div className="ml-4">
                  <div>{type === "text" ? "Text" : "Vocal"}</div>
                  <small>
                    {type === "text"
                      ? "Chat textuel pour échanger des messages."
                      : "Salon vocal pour discuter à haute voix."}
                  </small>
                </div>
                <input
                  type="radio"
                  name="channelType"
                  value={type}
                  checked={channelType === type}
                  onChange={handleChannelTypeChange}
                  className="custom-radio form-radio ml-auto"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block">Channel Name</label>
          <div className="flex mt-2 items-center">
            {channelType === "text" ? (
              <FiHash className="text-gray-400" />
            ) : (
              <FiSpeaker className="text-gray-400" />
            )}
            <input
              type="text"
              placeholder="new-channel"
              className="w-full ml-2 px-4 py-2 border border-gray-700 rounded text-gray-300 bg-gray-900"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            onClick={() => setCreateChannelModalOpen(false)}
          >
            Back
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => {
              // Votre fonction de création de channel ici
            }}
          >
            Create Channel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={updateChannelModalOpen}
        onRequestClose={() => setUpdateChannelModalOpen(false)}
        contentLabel="Update Channel Modal"
        className="m-auto w-1/3 p-6 bg-white border border-gray-300 rounded-md"
      >
        <h2 className="mb-4">Update Channel</h2>
        {/* ... */}
      </Modal>
    </div>
  );
};

export default SidebarChannel;
