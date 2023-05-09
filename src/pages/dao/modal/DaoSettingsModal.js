import React, { useState } from "react";
import Modal from "react-modal";
import SidebarDaoSettings from "./SidebarDaoSettings";
import OverviewButton from "./Buttons/Overview";
import RolesButton from "./Buttons/Roles";
import UpdateRole from "./Buttons/Modals/UpdateRole";

const DaoSettingsContent = ({
  activeContent,
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData = { daoData },
  setDaoData,
  setActiveContent,
  activeRoleId,
  setActiveRoleId,
}) => {
  switch (activeContent) {
    case "Overview":
      return (
        <OverviewButton
          daoData={daoData}
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
        />
      );
    case "Roles":
      return (
        <RolesButton
          daoSettingsModalOpen={daoSettingsModalOpen}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
          daoData={daoData}
          setDaoData={setDaoData}
          setActiveContent={setActiveContent}
          setActiveRoleId={setActiveRoleId}
        />
      );
    case "Members":

    case "Invitations":

    case "Ban":

    case "Security Alert":

    case "Web3 Management":

    case "Create Role":
      return (
        <UpdateRole
          daoData={daoData}
          setDaoSettingsModalOpen={setDaoSettingsModalOpen}
          setDaoData={setDaoData}
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          daoSettingsModalOpen={daoSettingsModalOpen}
          roleId={activeRoleId}
          setActiveRoleId={setActiveRoleId}
        />
      );

    default:
      return <OverviewButton />;
  }
};

const DaoSettingsModal = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData,
  setDaoData,
}) => {
  const [activeContent, setActiveContent] = useState("Overview");
  const [activeRoleId, setActiveRoleId] = useState(null);

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
          setDaoData={setDaoData}
          setActiveContent={setActiveContent}
          activeRoleId={activeRoleId}
          setActiveRoleId={setActiveRoleId}
        />
      </div>
    </Modal>
  );
};

export default DaoSettingsModal;
