import React, {useState, useEffect} from "react";
import { FiHash, FiSpeaker, FiThumbsUp } from "react-icons/fi";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Switch } from "@headlessui/react";
import { baseURL } from "../../../components/const";
import { customRadioStyle } from "../../../components/ChannelType";
import { ChannelType } from "../../../components/ChannelType";

const CreateChannelModal = ({
  createChannelModalOpen,
  setCreateChannelModalOpen,
  selectedCategoryId,
  setSelectedCategoryId,
  daoData,
  fetchDao
}) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [inputChannelName, setInputChannelName] = useState("");
  const [channelType, setChannelType] = useState("TEXT");

  const handleChannelTypeChange = (e) => {
    setChannelType(e.target.value);
  };

  const handleCreateChannel = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `${baseURL}/api/channel/create`,
        {
          daoId: daoData.id,
          userId: user.id,
          channelName: inputChannelName,
          channelType: channelType,
          categorieId: selectedCategoryId,
          isPrivate: isPrivate
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

  return (
    <Modal
      isOpen={createChannelModalOpen}
      onRequestClose={() => setCreateChannelModalOpen(false)}
      contentLabel="Create Channel Modal"
      className="m-auto w-1/2 p-6 bg-zinc-700 text-white border border-zinc-700 rounded-md overflow-y-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
      closeTimeoutMS={500}
    >
      <style>{customRadioStyle}</style>
      <h2 className="mb-4">Create Channel</h2>
      <ChannelType handleChannelTypeChange={handleChannelTypeChange} channelType={channelType}/>

      <div className="mb-4">
        <label className="block">Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full mt-2 px-4 py-2 border border-zinc-700 rounded text-zinc-300 bg-zinc-600"
        >
          {daoData.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block">Channel Name</label>
        <div className="flex mt-2 items-center">
          {channelType === "TEXT" ? (
            <FiHash className="text-gray-400" />
          ) : (
            <FiSpeaker className="text-gray-400" />
          )}
          <input
            type="text"
            placeholder="new-channel"
            value={inputChannelName}
            onChange={(e) => setInputChannelName(e.target.value)}
            className="w-full ml-2 px-4 py-2 border border-gray-700 rounded text-gray-300 bg-zinc-600"
          />
        </div>
      </div>
      <label className="block">Private Channel</label>
        <Switch
          checked={isPrivate}
          onChange={setIsPrivate}
          className={`${isPrivate ? 'bg-green-500' : 'bg-gray-500'} relative inline-flex items-center h-6 mt-2 rounded-full w-11`}
        >
          <span className="sr-only">Private</span>
          <span
            className={`${isPrivate ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
      <div className="flex justify-end">
        <button
          className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setCreateChannelModalOpen(false)}
        >
          Back
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCreateChannel}
        >
          Create Channel
        </button>
      </div>
    </Modal>
  );
};

export default CreateChannelModal;
