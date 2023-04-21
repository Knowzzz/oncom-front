import React, { useState } from "react";
import Modal from "react-modal";
import SidebarDaoSettings from "./SidebarDaoSettings";
import {
  Overview,
  Roles,
  Members,
  Invitations,
  Ban,
  SecurityAlert,
  Web3Management,
} from "./ButtonsDaoSettings";

const DaoSettingsContent = ({
  activeContent,
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData={daoData}
}) => {
  switch (activeContent) {
    case "Overview":
      return (
        <Overview
          daoData={daoData}
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Roles":
      return (
        <Roles
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Members":
      return (
        <Members
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Invitations":
      return (
        <Invitations
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Ban":
      return (
        <Ban
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Security Alert":
      return (
        <SecurityAlert
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Web3 Management":
      return (
        <Web3Management
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    default:
      return <Overview />;
  }
};

const DaoSettingsModal = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData,
}) => {
  const [activeContent, setActiveContent] = useState("Overview");

  return (
    <Modal
      isOpen={daoSettingsModalOpen}
      onRequestClose={() => setDaoSettingsModalOpen(false)}
      contentLabel="Dao Settings Modal"
      className="w-4/6 bg-zinc-700 text-white rounded-lg h-5/6"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
      closeTimeoutMS={500}
    >
      <div className="flex relative h-full">
        <SidebarDaoSettings
        daoData={daoData}
          activeContent={activeContent}
          setActiveContent={setActiveContent}
        />
        <DaoSettingsContent
          daoData={daoData}
          activeContent={activeContent}
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      </div>
    </Modal>
  );
};

export default DaoSettingsModal;
