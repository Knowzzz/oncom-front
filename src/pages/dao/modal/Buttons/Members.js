import React, { useState, useEffect, Fragment } from "react";
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const baseURL = "http://localhost:8080";

const MembersButton = ({
  setDaoSettingsModalOpen,
  users,
  daoData,
  setUsers,
  socketUsers
}) => {
  const [roleMenus, setRoleMenus] = useState({});

  const handleRoleRemove = async (user_wallet_address, roleId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const accessToken = localStorage.getItem("accessToken");

      if (socketUsers) {
        socketUsers.emit("role-user-remove", {
          userId: user.id,
          roleIds: [roleId],
          daoId: daoData.id,
          user_wallet_address: user_wallet_address
        });
      }

      // Update the roles of the user in the state
      setUsers(
        users.map((user) => {
          if (user.wallet_address === user_wallet_address) {
            return {
              ...user,
              userRoles: user.userRoles.filter(
                (userRole) => userRole.role.id !== roleId
              ),
            };
          }
          return user;
        })
      );

      toast.success("Role removed successfully");
    } catch (err) {
      toast.error("Failed to remove role");
      return err;
    }
  };
  const handleRoleClick = async (user_wallet_address, roleId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const accessToken = localStorage.getItem("accessToken");


      if (socketUsers) {
        socketUsers.emit("role-user-set", {
          userId: user.id,
          roleIds: [roleId],
          daoId: daoData.id,
          user_wallet_address: user_wallet_address
        });
      }

      // Get the new role from daoData
      const newRole = daoData.roles.find((role) => role.id === roleId);

      // Update the roles of the user in the state
      setUsers(
        users.map((user) => {
          if (user.wallet_address === user_wallet_address) {
            return {
              ...user,
              userRoles: [...user.userRoles, { role: newRole }],
            };
          }
          return user;
        })
      );

      toast.success("Role set successfully");
    } catch (err) {
      toast.error(err);
      console.log(err);
      return err;
    }
  };

  return (
    <>
      <div className="flex flex-col items-start w-full h-full">
        <ToastContainer />
        <button
          className="close-btn border border-zinc-400 rounded-full text-zinc-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
          onClick={() => setDaoSettingsModalOpen(false)}
        >
          <RxCross2 className="w-8 h-8" />
        </button>
        <h2 className="font-bold text-lg ml-6 mt-4 text-left mb-12">
          Server's Members
        </h2>
        <div className="w-full flex flex-col items-center overflow-auto h-full">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full w-5/6 pb-8 pt-4 text-sm border-y border-zinc-600"
            >
              <div className="flex flex-grow items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`${baseURL}/static${user.avatar}`}
                    alt="avatar"
                    className="mr-4 rounded-full w-1/12"
                  />
                  <div>
                    <p className="text-lg">{user.pseudo}</p>
                    <p className="text-sm text-zinc-500">
                      {user.wallet_address}
                    </p>
                  </div>
                </div>
                <Menu as="div" className="relative inline-block text-left z-10">
                  <Menu.Button className="text-zinc-500 hover:text-white rounded-sm bg-zinc-800 focus:outline-none mr-8 p-1">
                    <AiOutlinePlus className="inline" />
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-zinc-800 text-zinc-200 focus:outline-none">
                      <div className="py-1">
                        {daoData.roles
                          .filter(
                            (role) =>
                              role.name !== "everyone" &&
                              !user.userRoles.find(
                                (userRole) => userRole.role.id === role.id
                              )
                          )
                          .map((role, index) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? "bg-zinc-700 text-white hover:bg-blue-500"
                                      : "text-zinc-400"
                                  } flex px-4 py-2 text-sm w-full`}
                                  onClick={() =>
                                    handleRoleClick(
                                      user.wallet_address,
                                      role.id
                                    )
                                  }
                                  style={{ color: role.color }}
                                >
                                  {role.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <div className="flex flex-wrap items-center">
                  {user.userRoles.map((userRole, index) => (
                    <button
                      key={index}
                      className={`mr-2 mb-2 rounded p-1 text-sm hover:bg-zinc-700 ${
                        userRole.role.name === "everyone"
                          ? "bg-zinc-600"
                          : "bg-zinc-800"
                      }`}
                      style={{ color: userRole.role.color }}
                      onClick={() =>
                        userRole.role.name !== "everyone" &&
                        handleRoleRemove(user.wallet_address, userRole.role.id)
                      }
                      disabled={userRole.role.name === "everyone"}
                    >
                      {userRole.role.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MembersButton;
