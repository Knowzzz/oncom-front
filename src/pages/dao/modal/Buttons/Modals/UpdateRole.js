import React, { useState, Fragment, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowBack } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { SketchPicker } from "react-color";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { permissionsList } from "./PermissionsList";
import "react-toastify/dist/ReactToastify.css";
import { IoSearch } from "react-icons/io5";
import { IoCheckmark, IoClose } from "react-icons/io5";

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
    const updatedRoles = [...tempDaoData.roles];
    updatedRoles[roleIndex].color = color.hex;

    setTempDaoData({ ...tempDaoData, roles: updatedRoles });
    setUnsavedChanges(true);
  };

  const handleNameChange = (event) => {
    setSelectedRoleName(event.target.value);
    setUnsavedChanges(true);
  };

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
          key={roleId}
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


  const PermissionSwitch = ({ permission, onChange }) => {
    const [value, setValue] = useState(permission.defaultValue);

    const handleClick = () => {
      setValue(!value);
      onChange(permission.name, !value);
    };

    return (
      <div
        className={`${
          value ? "bg-green-500" : "bg-gray-700"
        } relative inline-block w-12 rounded-full overflow-hidden cursor-pointer transition-colors duration-200 ease-in`}
        onClick={handleClick}
      >
        <span
          className={`${
            value ? "translate-x-6" : "translate-x-0"
          } inline-block w-6 h-6 bg-white rounded-full transform transition-transform duration-200 ease-in`}
        ></span>
        <IoCheckmark
          className={`absolute top-1 left-1 text-xs ${
            value ? "text-white" : "text-transparent"
          }`}
        />
        <IoClose
          className={`absolute top-1 right-1 text-xs ${
            !value ? "text-white" : "text-transparent"
          }`}
        />
      </div>
    );
  };

  const PermissionsTab = () => {
    const [search, setSearch] = useState("");
    const [permissions, setPermissions] = useState({});

    const handleSearchChange = (event) => {
      setSearch(event.target.value);
    };

    const handlePermissionChange = (name, value) => {
      setPermissions({ ...permissions, [name]: value });
    };

    return (
      <div>
        <div className="flex items-center">
          <IoSearch className="w-5 h-5" />
          <input
            type="text"
            className="block w-full mb-4 p-2 rounded-md bg-zinc-800 text-zinc-400"
            placeholder="Search Roles"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <label className="font-semibold text-sm">Server Permissions</label>
        <div className="mt-4">
          {permissionsList.map((permission) => (
            <div
              key={permission.name}
              className="flex items-center justify-between mb-2"
            >
              <div>
                <p className="font-semibold">{permission.title}</p>
                <p className="text-xs text-gray-400">
                  {permission.description}
                </p>
              </div>
              <PermissionSwitch
                permission={permission}
                onChange={handlePermissionChange}
              />
            </div>
          ))}
        </div>
      </div>
    );
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
