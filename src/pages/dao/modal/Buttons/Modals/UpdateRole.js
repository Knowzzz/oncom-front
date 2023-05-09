import React, { useState, Fragment, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowBack } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { SketchPicker } from "react-color";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL = "http://localhost:8080";

const UpdateRole = ({
  setDaoSettingsModalOpen,
  daoSettingsModalOpen,
  daoData,
  setDaoData,
  activeContent,
  setActiveContent,
  roleId,
  setActiveRoleId,
}) => {
  const [selectedRoleColor, setSelectedRoleColor] = useState("#FFF");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [selectedTab, setSelectedTab] = useState("display");
  const [selectedRole, setSelectedRole] = useState(null);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [tempDaoData, setTempDaoData] = useState(daoData);

  useEffect(() => {
    if (!daoData) {
      return;
    }
    setTempDaoData(daoData);
  }, []);

  useEffect(() => {
    const role = tempDaoData.roles.find((role) => role.id === roleId);
    setSelectedRole(role);
    setSelectedTab("display");
    setSelectedRoleColor(role.color);
    setSelectedRoleName(role.name);
  }, [roleId, daoData]);

  const handleColorChange = (color) => {
    setSelectedRoleColor(color.hex);
    const roleIndex = tempDaoData.roles.findIndex((role) => role.id === roleId);

    // Créer une copie des rôles pour ne pas modifier directement l'état
    const updatedRoles = [...tempDaoData.roles];

    // Mettre à jour la couleur du rôle
    updatedRoles[roleIndex].color = color.hex;

    // Mettre à jour l'état de tempDaoData avec les rôles mis à jour
    setTempDaoData({ ...tempDaoData, roles: updatedRoles });
    setUnsavedChanges(true);
  };

  const handleNameChange = (event) => {
    setSelectedRoleName(event.target.value);
    setUnsavedChanges(true);
  }

  const resetChanges = () => {
    setTempDaoData(daoData);
    setSelectedRoleName(selectedRole.name);
    setSelectedRoleColor(selectedRole.color);
    setUnsavedChanges(false);
  };

  const saveChanges = async () => {};

  const RoleSidebar = () => {
    return (
      <div className="flex flex-col w-1/4 border-r border-zinc-400">
        <div className="flex items-center text-gray-400 hover:text-white px-4 py-2">
          <IoMdArrowBack className="w-6 h-6" />
          <span
            className="ml-2"
            onClick={() => {
              resetChanges();
              setActiveContent("Roles");
            }}
          >
            Retour
          </span>
        </div>
        <button className="text-white px-4 py-2 flex items-center">
          <FiPlus className="w-6 h-6" />
          <span className="ml-2">Ajouter un rôle</span>
        </button>
        <div className="flex flex-col mt-4">
          {tempDaoData.roles.map((role) => {
            if (role.name === "everyone") {
              return null;
            }
            return (
              <button
                key={role.id}
                className={`role-item text-white px-4 py-2 flex items-center ${
                  roleId === role.id ? "bg-zinc-600" : ""
                } hover:bg-zinc-800 rounded-lg mx-2 my-1`}
                onClick={() => setActiveRoleId(role.id)}
              >
                <span
                  className="rounded-full w-4 h-4 mr-2"
                  style={{ backgroundColor: role.color }}
                />
                {role.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleColorClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const DisplayTab = () => {
    return (
      <div>
        <label className="font-semibold text-sm">
          ROLE NAME <span className="text-red-500 text-sm">*</span>
        </label>
        <input
          type="text"
          className="block w-full mb-4 p-2 rounded-md bg-zinc-800 text-zinc-400"
          value={selectedRoleName}
          onChange={handleNameChange}
        />

        <label className="font-semibold text-sm">ROLE COLOR</label>
        <p className="mb-2 text-xs">
          Members use the color of the highest role they have in the role list.
        </p>
        <div
          className="w-10 h-10 border-2 border-gray-300 rounded"
          style={{ backgroundColor: selectedRoleColor }}
          onClick={handleColorClick}
        ></div>
        {displayColorPicker ? (
          <div className="absolute z-10">
            <div className="fixed inset-0" onClick={handleClose}></div>
            <SketchPicker
              color={selectedRoleColor}
              onChangeComplete={handleColorChange}
            />
          </div>
        ) : null}
      </div>
    );
  };

  const PermissionsTab = () => {
    // Permissions Tab Content
  };

  return (
    <div className="w-full h-full">
      {daoSettingsModalOpen && (
        <div className="relative flex">
          <button
            className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
            onClick={() => setDaoSettingsModalOpen(false)}
          >
            <RxCross2 className="w-8 h-8" />
          </button>
        </div>
      )}
      <div className="flex h-full">
        <RoleSidebar />
        {/* Content Area */}
        <div className="w-3/4 p-4 overflow-y-scroll">
          <h3 className="mb-2 font-bold uppercase">
            UPDATE ROLE - {selectedRole ? selectedRole.name : ""}
          </h3>
          <div className=" mb-4">
            <button
              className={`mr-4 ${
                selectedTab === "display"
                  ? "border-b-2 border-blue-400 text-white"
                  : "hover:text-zinc-300 text-zinc-400 hover:border-b-2 hover:border-blue-300"
              }`}
              onClick={() => setSelectedTab("display")}
            >
              Affichage
            </button>
            <button
              className={`${
                selectedTab === "permissions"
                  ? "border-b-2 border-blue-400 text-white"
                  : "hover:text-zinc-300 text-zinc-400 hover:border-b-2 hover:border-blue-300"
              }`}
              onClick={() => setSelectedTab("permissions")}
            >
              Permissions
            </button>
          </div>

          {selectedTab === "display" ? <DisplayTab /> : <PermissionsTab />}
        </div>
      </div>
      {unsavedChanges && (
        <div className="fixed bottom-0 left-1/4 w-1/2 p-4 bg-black rounded-lg animate-bounceY">
          <p className="text-gray-400 inline-block">
            Attention there are still unsaved modifications
          </p>
          <button
            className="bg-transparent text-gray-400 hover:text-white px-4 py-2 ml-4"
            onClick={resetChanges}
          >
            Réinitialiser
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 ml-4"
            onClick={saveChanges}
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateRole;
