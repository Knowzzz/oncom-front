import React, {useState, useEffect} from 'react';
import { FiHash, FiSpeaker, FiThumbsUp } from "react-icons/fi";
import Modal from "react-modal";
import { Switch } from "@headlessui/react";

const UpdateChannelModal = ({
  updateChannelModalOpen,
  setUpdateChannelModalOpen,
  selectedCategoryId,
  setSelectedCategoryId,
  daoData,
  handleUpdateChannel,
  channelId
}) => {
  let currentChannel;
  if (daoData && daoData.channels) {
    currentChannel = daoData.channels.find(channel => Number(channel.id) === Number(channelId));
  }
  const [inputChannelName, setInputChannelName] = useState(currentChannel.name);
  const [channelType, setChannelType] = useState(currentChannel.type);
  const [isPrivate, setIsPrivate] = useState(currentChannel.isPrivate);

  

  const handleChannelTypeChange = (e) => {
    setChannelType(e.target.value);
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

  const addRolesAlert = () => {
    alert("Adding Roles");
  };

  return (
    <Modal
      isOpen={updateChannelModalOpen}
      onRequestClose={() => setUpdateChannelModalOpen(false)}
      contentLabel="Update Channel Modal"
      className="m-auto w-1/2 z-1000 p-6 bg-zinc-700 text-white border border-zinc-700 rounded-md overflow-y-auto h-5/6"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
      closeTimeoutMS={500}
    >
      <style>{customRadioStyle}</style>
      <h2 className="mb-4">Update Channel</h2>
      <div className="mb-4">
        <div className="grid gap-4">
          {["TEXT", "VOCAL", "VOTE"].map((type) => (
            <label
              key={type}
              className={`flex p-4 border border-gray-600 rounded ${
                channelType === type ? "border-white" : "hover:border-zinc-400"
              } cursor-pointer`}
            >
              {type === "TEXT" ? <FiHash size={24} /> : type === "VOCAL" ? <FiSpeaker size={24} /> : <FiThumbsUp size={24} />}
              <div className="ml-4">
                <div>{type}</div>
                <small>
                  {type === "TEXT"
                    ? "Chat textuel pour échanger des messages."
                    : type === "VOCAL"
                    ? "Salon vocal pour discuter à haute voix."
                    : "Salon pour créer et gérer les votes."}
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
          ) : channelType === "VOCAL" ? (
            <FiSpeaker className="text-gray-400" />
          ) : (
            <FiThumbsUp className="text-gray-400" />
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
      
      <div className="mb-4">
        <label className="block">Private Channel</label>
        <Switch
          checked={isPrivate}
          onChange={setIsPrivate}
          className={`${isPrivate ? 'bg-green-500' : 'bg-gray-500'} relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className="sr-only">Private</span>
          <span
            className={`${isPrivate ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
        {isPrivate && (
          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={addRolesAlert}
            >
              Add Roles
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setUpdateChannelModalOpen(false)}
        >
          Back
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleUpdateChannel}
        >
          Update Channel
        </button>
      </div>
    </Modal>
  );
};

export default UpdateChannelModal;
