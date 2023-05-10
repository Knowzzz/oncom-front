import Modal from "react-modal";
import React from "react";

const CreateCategorie = ({
  createCategorieModalOpen,
  setCreateCategorieModalOpen,
  setInputCategorieName,
  inputCategorieName,
  handleCreateCategorie,
}) => {
  return (
    <Modal
      isOpen={createCategorieModalOpen}
      onRequestClose={() => setCreateCategorieModalOpen(false)}
      contentLabel="Create Categorie Modal"
      className="m-auto w-1/3 p-6 bg-zinc-700 text-white border border-zinc-700 rounded-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
      closeTimeoutMS={500}
    >
      <h2 className="mb-4">Create Channel</h2>
      <input
        type="text"
        placeholder="new-channel"
        value={inputCategorieName}
        onChange={(e) => setInputCategorieName(e.target.value)}
        className="w-full ml-2 px-4 py-2 border border-gray-700 rounded text-gray-300 bg-zinc-800 mb-4"
      />
      <div className="flex justify-end">
        <button
          className="bg-zinc-600 hover:bg-zinc-600 text-white px-4 py-2 rounded mr-2"
          onClick={() => setCreateCategorieModalOpen(false)}
        >
          Back
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCreateCategorie}
        >
          Create Channel
        </button>
      </div>
    </Modal>
  );
};

export default CreateCategorie;
