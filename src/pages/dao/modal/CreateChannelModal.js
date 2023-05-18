import React from "react";
import { FiHash, FiSpeaker } from "react-icons/fi";
import Modal from "react-modal";

const CreateChannelModal = ({
  createChannelModalOpen,
  setCreateChannelModalOpen,
  channelType,
  handleChannelTypeChange,
  selectedCategoryId,
  setSelectedCategoryId,
  daoData,
  inputChannelName,
  setInputChannelName,
  handleCreateChannel,
}) => {
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

  return (
    <Modal
      isOpen={createChannelModalOpen}
      onRequestClose={() => setCreateChannelModalOpen(false)}
      contentLabel="Create Channel Modal"
      className="m-auto w-1/3 p-6 bg-zinc-700 text-white border border-zinc-700 rounded-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
      closeTimeoutMS={500}
    >
      <style>{customRadioStyle}</style>
      <h2 className="mb-4">Create Channel</h2>
      <div className="mb-4">
        <div className="grid gap-4">
          {["TEXT", "VOCAL"].map((type) => (
            <label
              key={type}
              className={`flex p-4 border border-gray-600 rounded ${
                channelType === type ? "border-white" : "hover:border-zinc-400"
              } cursor-pointer`}
            >
              {type === "text" ? <FiHash size={24} /> : <FiSpeaker size={24} />}
              <div className="ml-4">
                <div>{type === "TEXT" ? "Text" : "Vocal"}</div>
                <small>
                  {type === "TEXT"
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
