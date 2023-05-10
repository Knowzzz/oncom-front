import Modal from "react-modal";
import React from "react";

const UpdateChannelModal = ({
  updateChannelModalOpen,
  setUpdateChannelModalOpen,
}) => {
  return (
    <Modal
      isOpen={updateChannelModalOpen}
      onRequestClose={() => setUpdateChannelModalOpen(false)}
      contentLabel="Update Channel Modal"
      className="m-auto w-1/3 p-6 bg-white border border-gray-300 rounded-md"
    >
      <h2 className="mb-4">Update Channel</h2>
      {/* ... */}
    </Modal>
  );
};

export default UpdateChannelModal;
