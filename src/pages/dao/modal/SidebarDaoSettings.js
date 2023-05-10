import React, { useState } from "react";
import Modal from "react-modal";

const SidebarDaoSettings = ({ setActiveContent, activeContent, daoData }) => {
  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  return (
    <div className="bg-zinc-800 rounded-lg h-full flex flex-col">
      <h2 className="mb-4 mt-2 text-center">DAO Settings</h2>
      <div className="flex flex-col justify-between flex-1 p-1">
        <div>
          <h2 className="font-bold text-lg mb-2 px-2">{daoData.name}</h2>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc rounded"
            onClick={() => handleButtonClick("Overview")}
          >
            Overview
          </button>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc rounded"
            onClick={() => handleButtonClick("Roles")}
          >
            Roles
          </button>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc rounded"
            onClick={() => handleButtonClick("Members")}
          >
            Members
          </button>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc rounded"
            onClick={() => handleButtonClick("Invitations")}
          >
            Invitations
          </button>
          <h2 className="font-bold text-lg mb-2 px-2">Moderation</h2>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc rounded"
            onClick={() => handleButtonClick("Ban")}
          >
            Ban
          </button>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc rounded"
            onClick={() => handleButtonClick("Security Alert")}
          >
            Security Alert
          </button>
          <button
            className="block w-full text-left px-4 py-2 mb-2 hover:bg-zinc-700 rounded"
            onClick={() => handleButtonClick("Web3 Management")}
          >
            Web3 Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarDaoSettings;
