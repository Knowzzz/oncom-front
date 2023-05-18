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

const DisplayTab = ({
  setUnsavedChanges,
  roleName,
  setRoleName,
  handleColorClick,
  displayColorPicker,
  handleClose,
  selectedRoleColor,
  setSelectedRoleColor,
  roleId,
  daoData,
  setDaoData,
  tempDaoData,
  setTempDaoData,
  setActiveRoleId,
}) => {
  const isEveryoneRole = roleName.toLowerCase() === "everyone";

  const inputRef = React.useRef(null);
  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setRoleName(event.target.value);
    inputRef.current.focus(); // refocus after changing the state
  };

  const handleDeleteRole = async () => {
    const daoId = daoData.id;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const accessToken = localStorage.getItem("accessToken");

    if (!daoId || !userId || !accessToken || !roleId) {
      toast.error("Missing information(s)");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/role/delete`,
        {
          daoId: daoData.id,
          userId: userId,
          roleId: roleId,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      setDaoData((prevDaoData) => {
        return {
          ...prevDaoData,
          roles: prevDaoData.roles.filter((role) => role.id !== roleId),
        };
      });

      setTempDaoData((prevTempDaoData) => {
        return {
          ...prevTempDaoData,
          roles: prevTempDaoData.roles.filter((role) => role.id !== roleId),
        };
      });

      setActiveRoleId(daoData.roles[0].id);

      toast.success("Role deleted successfully", { position: "bottom-right" });
    } catch (error) {
      toast.error("Error while deleted role", { position: "bottom-right" });
    }
  };

  const handleColorChange = (color) => {
    setSelectedRoleColor(color.hex);
    setUnsavedChanges(true);
  };

  return (
    <div className="flex flex-col h-5/6 justify-between">
      <div>
        <label className="font-semibold text-sm">
          ROLE NAME <span className="text-red-500 text-sm">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          className="w-full mb-4 p-2 rounded-md bg-zinc-800 text-zinc-400"
          value={roleName}
          onChange={handleNameChange}
          disabled={isEveryoneRole} // Disable input if it's the "everyone" role
        />

        <label className="font-semibold text-sm">ROLE COLOR</label>
        <p className="mb-2 text-xs">
          Members use the color of the highest role they have in the role list.
        </p>
        <div
          className={`w-10 h-10 border-2 border-gray-300 rounded ${
            isEveryoneRole ? "cursor-not-allowed" : ""
          }`}
          style={{ backgroundColor: selectedRoleColor }}
          onClick={!isEveryoneRole ? handleColorClick : undefined} // Ignore click if it's the "everyone" role
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
      <div className="flex justify-center items-end">
        <button
          type="button"
          className="bg-red-500 text-white w-2/4 p-2 rounded-md hover:bg-red-600"
          onClick={handleDeleteRole}
        >
          Supprimer le role
        </button>
      </div>
    </div>
  );
};

const UpdateRole = ({
  setDaoSettingsModalOpen,
  daoSettingsModalOpen,
  daoData,
  activeContent,
  setActiveContent,
  setDaoData,
  roleId,
  setActiveRoleId,
}) => {
  const [selectedRoleColor, setSelectedRoleColor] = useState("#FFF");
  const [selectedTab, setSelectedTab] = useState("display");
  const [selectedRole, setSelectedRole] = useState(null);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [tempDaoData, setTempDaoData] = useState(daoData);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [roleNameEdited, setRoleNameEdited] = useState(false);

  useEffect(() => {
    if (!daoData) {
      return;
    }
    const sortedDaoData = { ...daoData };
    sortedDaoData.roles = sortedDaoData.roles.sort(
      (a, b) => b.position - a.position
    );
    setTempDaoData(sortedDaoData);
  }, [daoData]);

  useEffect(() => {
    if (!tempDaoData) {
      return;
    }
    const role = tempDaoData.roles.find((role) => role.id === roleId);

    if (!role) {
      return;
    }

    setSelectedRole(role);
    setSelectedTab("display");
    if (!roleNameEdited) {
      setRoleName(role.name);
    }
    setSelectedRoleColor(role.color);
    setPermissions(role.rolePermissions);
  }, [roleId, daoData]);

  const resetChanges = () => {
    setTempDaoData(daoData);
    setSelectedRoleColor(selectedRole.color);
    setUnsavedChanges(false);
  };

  const handlePermissionChange = (name, value) => {
    setPermissions({ ...permissions, [name]: value });
  };

  const CreateRole = async () => {
    try {
      const daoId = daoData.id;
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const accessToken = localStorage.getItem("accessToken");

      if (!daoId || !userId || !accessToken) {
        toast.error("Missing information(s)");
        return;
      }

      const response = await axios.post(
        `${baseURL}/api/role/create`,
        {
          daoId: daoData.id,
          userId,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.data.error) {
        toast.error("Error creating role");
        return;
      }

      let newRoles = [...daoData.roles, response.data.role];
      newRoles.sort((a, b) => b.position - a.position);

      setDaoData((prevDaoData) => {
        return {
          ...prevDaoData,
          roles: newRoles,
        };
      });

      setTempDaoData((prevTempDaoData) => {
        return {
          ...prevTempDaoData,
          roles: newRoles,
        };
      });

      setActiveRoleId(response.data.role.id);

      toast.success("Role created successfully", { position: "bottom-right" });
    } catch (error) {
      toast.error("Error creating role", { position: "bottom-right" });
    }
  };

  const saveChanges = async (roleId) => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const accessToken = localStorage.getItem("accessToken");
    const daoId = daoData.id;

    if (!daoId || !userId || !accessToken) {
      toast.error("Missing information(s)");
      return;
    }

    const updatedRole = {
      roleId: roleId,
      rolePermissions: permissions, // use the state variable directly
      roleName: roleName, // use the state variable directly
      roleColor: selectedRoleColor,
    };
    try {
      const response = await axios.put(
        `${baseURL}/api/role/update`,
        {
          userId: userId,
          daoId: daoId,
          roleInfos: updatedRole,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.data.error) {
        toast.error(`Error updating role : ${response.data.error}`, {
          position: "bottom-right",
        });
      }

      // Extract the updated role from the response
      const updatedRoleFromResponse = response.data.role;

      // Update tempDaoData
      const tempRoleIndex = tempDaoData.roles.findIndex(
        (role) => role.id === roleId
      );
      const tempUpdatedRoles = [...tempDaoData.roles];
      tempUpdatedRoles[tempRoleIndex] = updatedRoleFromResponse;
      tempUpdatedRoles.sort((a, b) => b.position - a.position); // trier les rôles par position

      const daoUpdatedRoles = [...daoData.roles];
      daoUpdatedRoles[tempRoleIndex] = updatedRoleFromResponse;
      daoUpdatedRoles.sort((a, b) => b.position - a.position); // trier les rôles par position

      setTempDaoData({ ...tempDaoData, roles: tempUpdatedRoles });
      setDaoData({ ...daoData, roles: daoUpdatedRoles });

      toast.success("Role sucessfully updated", { position: "bottom-right" });
    } catch (err) {
      toast.error("Error(s) updating role", { position: "bottom-right" });
    }
    setUnsavedChanges(false);
  };

  const RoleSidebar = () => {
    return (
      <div className="flex flex-col w-1/4 border-r border-zinc-500">
        <div
          className="flex items-center text-gray-400 hover:text-white px-4 py-2"
          onClick={() => {
            resetChanges();
            setActiveContent("Roles");
          }}
        >
          <IoMdArrowBack className="w-6 h-6" />
          <span className="ml-2">Retour</span>
        </div>
        <button
          className="hover:text-white px-4 py-2 flex items-center text-gray-400"
          onClick={CreateRole}
        >
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
                  style={{
                    backgroundColor:
                      roleId === role.id ? selectedRoleColor : role.color,
                  }}
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

  const PermissionSwitch = ({ permission, onChange }) => {
    const [value, setValue] = useState(permissions[permission.name]);

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
        style={{ transition: "background-color 0.3s ease" }} // add transition here
      >
        <span
          className={`${
            value ? "translate-x-6" : "translate-x-0"
          } inline-block w-6 h-6 bg-white rounded-full transform transition-transform duration-200 ease-in`}
          style={{ transition: "transform 0.3s ease" }} // add transition here
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

  const PermissionsTab = ({
    permissions,
    onPermissionChange,
    setUnsavedChanges,
  }) => {
    const [search, setSearch] = useState("");
    const [filteredPermissions, setFilteredPermissions] =
      useState(permissionsList);

    const handleSearchChange = (event) => {
      setSearch(event.target.value);
    };

    const handlePermissionChange = (name, value) => {
      onPermissionChange(name, value);
      setUnsavedChanges(true);
    };

    useEffect(() => {
      const results = permissionsList.filter((permission) =>
        permission.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPermissions(results);
    }, [search]);

    return (
      <div>
        <div className="flex items-center">
          <IoSearch className="w-5 h-5" />
          <input
            type="text"
            className="block w-full mb-4 p-2 rounded-md bg-zinc-800 text-zinc-400"
            placeholder="Search Permissions"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <label className="font-semibold text-sm">Server Permissions</label>
        <div className="mt-4">
          {filteredPermissions.map((permission) => (
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

          {selectedTab === "display" ? (
            <DisplayTab
              setUnsavedChanges={setUnsavedChanges}
              roleName={roleName}
              setRoleName={setRoleName}
              handleColorClick={handleColorClick}
              displayColorPicker={displayColorPicker}
              handleClose={handleClose}
              selectedRoleColor={selectedRoleColor}
              setSelectedRoleColor={setSelectedRoleColor}
              roleId={roleId}
              daoData={daoData}
              setDaoData={setDaoData}
              setTempDaoData={setTempDaoData}
              tempDaoData={tempDaoData}
              setActiveRoleId={setActiveRoleId}
            />
          ) : (
            <PermissionsTab
              permissions={permissions}
              onPermissionChange={handlePermissionChange}
              setUnsavedChanges={setUnsavedChanges}
            />
          )}
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
            onClick={() => saveChanges(roleId)} // pass roleId as argument
          >
            Save changes
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UpdateRole;
