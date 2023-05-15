import React, { useState, useEffect, Fragment } from "react";
import { RxCross2 } from "react-icons/rx";
import { BsArrowRightShort } from "react-icons/bs";
import { IoPersonCircleOutline, IoEllipsisVertical } from "react-icons/io5";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { TbGridDots } from "react-icons/tb";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
const baseURL = "http://localhost:8080";

const RolesButton = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData,
  setDaoData,
  setActiveContent,
  setActiveRoleId,
}) => {
  const [hoveredRoleId, setHoveredRoleId] = useState(null);
  const [tempDaoData, setTempDaoData] = useState(daoData);
  const [unsavedChange, setUnsavedChange] = useState(false);

  useEffect(() => {
    if (!daoData) { return }
    setTempDaoData(daoData);
  }, [daoData]);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Role ID copied to clipboard", {
          position: "bottom-right",
        });
      })
      .catch((err) => {
        toast.error("Failed to copy Role ID", { position: "bottom-right" });
      });
  };

  const handleDeleteRole = async (roleId) => {
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
        toast.error("Error creating role");
        return;
      }

      setDaoData((prevDaoData) => {
        return {
          ...prevDaoData,
          roles: prevDaoData.roles.filter((role) => role.id !== roleId),
        };
      });

      toast.success("Role created successfully", { position: "bottom-right" });
    } catch (error) {
      toast.error("Error creating role", { position: "bottom-right" });
    }
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

      setDaoData((prevDaoData) => {
        return {
          ...prevDaoData,
          roles: [...prevDaoData.roles, response.data.role],
        };
      });
      setActiveRoleId(response.data.role.id);
      setActiveContent("Update Role");

      toast.success("Role created successfully", { position: "bottom-right" });
    } catch (error) {
      toast.error("Error creating role", { position: "bottom-right" });
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
  
    let items = Array.from(tempDaoData.roles);
  
    items = items.filter(role => role.name !== 'everyone').sort((a, b) => b.position - a.position);
  
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    const updatedItems = items.map((role, index) => ({
      ...role,
      position: items.length - index, 
    }));
  
    updatedItems.unshift(tempDaoData.roles.find(role => role.name === 'everyone'));
    setUnsavedChange(true);
  
    setTempDaoData(prev => ({...prev, roles: updatedItems}));
  };


  const handleReset = () => {
    setTempDaoData(daoData);
    setUnsavedChange(false);
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(tempDaoData.roles)

    try {
      const response = await axios.put(
        `${baseURL}/api/role/changePosition`,
        {
          updatedRoles: tempDaoData.roles,
          userId: JSON.parse(localStorage.getItem("user")).id,
          daoId: daoData.id,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.data.error) {
        toast.error("Error updating roles");
        return;
      }

      setDaoData(tempDaoData);
      toast.success("Roles updated successfully", { position: "bottom-right" });
      setUnsavedChange(false);
    } catch (error) {
      toast.error("Error updating roles", { position: "bottom-right" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-start w-full">
        <button
          className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
          onClick={() => setDaoSettingsModalOpen(false)}
        >
          <RxCross2 className="w-8 h-8" />
        </button>
        <h2 className="font-bold text-lg ml-6 mt-4 text-left">Roles</h2>
        <p className="text-zinc-500 mb-6 text-left ml-6">
          Use roles to group users in your server and manage permissions.
        </p>
        <div className="w-full flex flex-col items-center">
          <button
            className="bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded flex flex-col items-start mb-4 w-11/12"
            onClick={() => {
              const role = daoData.roles.find(
                (role) => role.name == "everyone"
              );
              setActiveRoleId(role.id);
              setActiveContent("Update Role");
            }}
          >
            <span className="text-gray-400 text-lg">Default Permissions</span>
            <span className="text-sm text-gray-500 ml-2">
              @everyone - Applies to all server members
            </span>
            <BsArrowRightShort className="ml-auto text-xl" />
          </button>
          <div className="flex items-center justify-between w-11/12">
            <div className="bg-zinc-900 flex items-center rounded px-3 py-2 w-10/12">
              <AiOutlineSearch className="text-gray-400" />
              <input
                type="text"
                className="bg-transparent ml-3 w-full focus:outline-none text-white"
                placeholder="Search roles"
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-2/12 ml-4"
              onClick={CreateRole}
            >
              Create Role
            </button>
          </div>
          <div className="roles-list mt-4 w-11/12">
            <p className="font-bold text-zinc-400">
              Roles - {daoData.roles.length - 1}
            </p>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="roles">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {tempDaoData.roles
                      .filter((role) => role.name !== "everyone")
                      .sort((a, b) => b.position - a.position)
                      .map((role, index) => {
                        return (
                          <Draggable
                            key={role.id}
                            draggableId={role.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className="role-container bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded mb-2 w-full flex items-center relative border-b border-zinc-600"
                                  onMouseEnter={() => setHoveredRoleId(role.id)}
                                  onMouseLeave={() => setHoveredRoleId(null)}
                                >
                                  <IoPersonCircleOutline
                                    className="mr-4"
                                    style={{
                                      color: role.color,
                                      fontSize: "1.5rem",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span className="role-name align-middle flex-grow">
                                    {role.name}
                                  </span>
                                  {hoveredRoleId === role.id && (
                                    <FaPencilAlt
                                      className="text-gray-500 hover:text-white rounded-full bg-zinc-800"
                                      style={{
                                        fontSize: "1.8rem",
                                        verticalAlign: "middle",
                                        padding: "6px",
                                        position: "absolute",
                                        right: "4rem",
                                        top: "46%",
                                        transform: "translateY(-50%)",
                                      }}
                                      onClick={() => {
                                        setActiveRoleId(role.id);
                                        setActiveContent("Update Role");
                                      }}
                                    />
                                  )}
                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left z-10"
                                  >
                                    <Menu.Button className="text-gray-500 hover:text-white rounded-full bg-zinc-800 focus:outline-none">
                                      <IoEllipsisVertical
                                        style={{
                                          fontSize: "1.8rem",
                                          verticalAlign: "middle",
                                          padding: "4px",
                                        }}
                                      />
                                    </Menu.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-zinc-800 text-gray-200 focus:outline-none">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                className={`${
                                                  active
                                                    ? "bg-zinc-700 text-white hover:bg-blue-500"
                                                    : "text-gray-400"
                                                } flex px-4 py-2 text-sm w-full`}
                                                onClick={() =>
                                                  copyToClipboard(role.id)
                                                }
                                              >
                                                Copier l'ID
                                              </button>
                                            )}
                                          </Menu.Item>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                className={`${
                                                  role.name === "everyone"
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : active
                                                    ? "bg-zinc-700 text-white hover:bg-red-500"
                                                    : "text-red-500"
                                                } flex px-4 py-2 text-sm w-full`}
                                                onClick={
                                                  role.name === "everyone"
                                                    ? null
                                                    : () =>
                                                        handleDeleteRole(
                                                          role.id
                                                        )
                                                }
                                                disabled={
                                                  role.name === "everyone"
                                                }
                                              >
                                                Supprimer
                                              </button>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          {unsavedChange && (
            <div className="fixed bottom-0 left-1/4 w-1/2 p-4 bg-black rounded-lg animate-bounceY">
              <p className="text-gray-400 inline-block">
                Attention there are still unsaved modifications
              </p>
              <button
                className="bg-transparent text-gray-400 hover:text-white px-4 py-2 ml-4"
                onClick={handleReset}
              >
                Réinitialiser
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-4"
                onClick={handleSave}
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default RolesButton;
