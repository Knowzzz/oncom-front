import React, { useState, useEffect, Fragment } from "react";
import SidebarServers from "../../components/SidebarServers";
import SidebarFriend from "../../components/SidebarFriend";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, Link } from "react-router-dom";
import SearchModal from "./SearchModal";
import UserProfile from "../../components/UserProfile";
import { Menu, Transition } from "@headlessui/react";

const baseURL = "http://localhost:8080";

const MainPage = () => {
  const [pendingFriends, setPendingFriends] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const acceptFriend = async (friend_wallet_address) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `${baseURL}/api/friend/accept`,
        {
          userId: user.id,
          friend_wallet_address: friend_wallet_address,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const declineFriend = async (friend_wallet_address) => {
    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.post(
      `${baseURL}/api/friend/decline`,
      {
        userId: user.id,
        friend_wallet_address: friend_wallet_address,
      },
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    );
    try {
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const blockFriend = async (friend_wallet_address) => {
    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.post(
      `${baseURL}/api/friend/block`,
      {
        userId: user.id,
        friend_wallet_address: friend_wallet_address,
      },
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    );
    try {
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const result = await axios.get(
          `${baseURL}/api/friend/getAllFriendRequest`,
          {
            params: {
              userId: user.id,
            },
            headers: {
              "x-access-token": accessToken,
            },
          }
        );

        const friendsWithAvatars = await Promise.all(
          result.data.friendRequests.map(async (friendRequest) => {
            const friend = friendRequest.friend;
            const user = friendRequest.user;
            try {
              const friendAvatarResponse = await axios.get(
                `${baseURL}/static/${friend.avatar}`,
                {
                  responseType: "blob",
                }
              );
              const userAvatarResponse = await axios.get(
                `${baseURL}/static/${user.avatar}`,
                {
                  responseType: "blob",
                }
              );
              const friendAvatarUrl = URL.createObjectURL(
                friendAvatarResponse.data
              );
              const userAvatarUrl = URL.createObjectURL(
                userAvatarResponse.data
              );
              return {
                ...friendRequest,
                friend: { ...friend, avatar: friendAvatarUrl },
                user: { ...user, avatar: userAvatarUrl },
              };
            } catch (err) {
              console.log(err);
              return {
                ...friendRequest,
                friend: { ...friend, avatar: "" },
                user: { ...user, avatar: "" },
              };
            }
          })
        );

        setPendingFriends(friendsWithAvatars);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="bg-zinc-700 h-screen w-screen">
      <div className="flex h-full">
        <SidebarServers />
        <SidebarFriend />
        <div className="bg-zinc-700 flex flex-col p-6 flex-grow">
          <div className="flex items-center mb-4">
            <div className="text-white text-2xl font-semibold">Friends</div>
            <button
              className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
              onClick={toggleModal}
            >
              Add
            </button>
            <Link
              className="bg-zinc-600 text-white px-2 py-1 ml-2 rounded hover:bg-zinc-500"
              to="/main"
            >
              Online
            </Link>
            <Link
              className="bg-zinc-800 text-gray-300 px-2 py-1 ml-2 rounded hover:bg-zinc-400"
              to="/main/friend/pending"
            >
              Pending
            </Link>
            <Link
              className="bg-zinc-600 text-gray-300 px-2 py-1 ml-2 rounded hover:bg-zinc-500"
              to="/main/friend/blocked"
            >
              Blocked
            </Link>
          </div>
          <div className="relative">
            <input
              type="text"
              className="bg-zinc-600 text-white w-full h-10 pl-3 pr-10 rounded-md"
              placeholder="Search"
            />
            <BsSearch className="absolute right-3 top-2 text-white" />
          </div>
          <div className="text-white font-semibold mt-4">Pending</div>
          <div className="flex flex-col mt-2">
            {pendingFriends
              ? pendingFriends.map((friendRequest) => (
                  <div
                    key={friendRequest.id}
                    className="bg-zinc-600 w-full h-16 flex items-center p-4 mb-2 rounded-md"
                  >
                    <img
                      src={
                        friendRequest.user.avatar
                          ? friendRequest.user.avatar
                          : "/image.jpg"
                      }
                      alt={friendRequest.user.pseudo}
                      className="w-12 h-12 rounded-full mr-4"
                    />

                    <div className="text-white font-semibold">
                      {friendRequest.user.pseudo}
                    </div>
                    <div className="ml-auto">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button className="flex items-center justify-center w-full shadow-sm px-2 py-2 text-sm font-medium text-gray-700 focus:outline-none">
                          <HiOutlineDotsVertical className="text-white w-8 h-8 p-1 rounded-full bg-zinc" />
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
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-zinc text-gray-700 focus:outline-none">
                            <div className="py-1 bg-zinc rounded-lg">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-zinc-600 text-black"
                                        : "text-black"
                                    } flex px-2 py-1 text-sm bg-zinc text-green-600 rounded-md w-full`}
                                    onClick={() =>
                                      acceptFriend(
                                        friendRequest.user.wallet_address
                                      )
                                    }
                                  >
                                    Accepter
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-zinc-600 text-black"
                                        : "text-black"
                                    } flex px-2 py-1 text-sm bg-zinc text-red-500 rounded-md w-full`}
                                    onClick={() =>
                                      declineFriend(
                                        friendRequest.user.wallet_address
                                      )
                                    }
                                  >
                                    Supprimer
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-zinc-600 text-black"
                                        : "text-black"
                                    } flex px-2 py-1 text-sm bg-zinc text-black rounded-md w-full`}
                                    onClick={() =>
                                      blockFriend(
                                        friendRequest.friend.wallet_address
                                      )
                                    }
                                  >
                                    Bloquer
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
        <UserProfile />
        <SearchModal isOpen={isModalOpen} closeModal={toggleModal} />
      </div>
    </div>
  );
};

export default MainPage;
