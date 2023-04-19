import React, { useState, useEffect, Fragment } from "react";
import SidebarServers from "../../components/SidebarServers";
import SidebarFriend from "../../components/SidebarFriend";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, Link } from "react-router-dom";
import SearchModal from "./SearchModal";
import { Menu, Transition } from "@headlessui/react";
import UserProfile from "../../components/UserProfile";
import { TbMessageCircle2Filled } from "react-icons/tb";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL = "http://localhost:8080";

const MainPage = () => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actualUserId, setActualUserId] = useState(null);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const deleteFriend = async (friend_wallet_address) => {
    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    setActualUserId(user.id);
    const response = await axios.post(
      `${baseURL}/api/friend/delete`,
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
    if (response.status === 200) {
      const success = () => toast("Friend successfully deleted");
      window.location.reload();
      return success;
    }
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
      setActualUserId(user.id);
      try {
        const result = await axios.get(`${baseURL}/api/friend/getAll`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
  
        const friendsWithAvatars = await Promise.all(
          result.data.friends.map(async (friendRequest) => {
            const friend = friendRequest.friend;
            const friendAvatar = await getAvatar(friend);
            const userAvatar = await getAvatar(friendRequest.user);
  
            return {
              ...friendRequest,
              friend: { ...friend, avatar: friendAvatar },
              user: { ...friendRequest.user, avatar: userAvatar },
            };
          })
        );
        console.log(friendsWithAvatars);
        setOnlineFriends(friendsWithAvatars);
      } catch (err) {
        console.log(err);
        return err;
      }
    };
  
    const getAvatar = async (user) => {
      try {
        const avatarResponse = await axios.get(
          `${baseURL}/static${user.avatar}`,
          {
            responseType: "blob",
          }
        );
        const avatarUrl = URL.createObjectURL(avatarResponse.data);
        return avatarUrl;
      } catch (err) {
        console.log(err);
        return "";
      }
    };
  
    fetchFriends();
  }, []);
  
  

  return (
    <div className="bg-gray-800 h-screen w-screen">
      <div className="flex h-full">
        <SidebarServers />
        <SidebarFriend />
        <div className="bg-gray-700 w-fullflex flex-col p-6 flex-grow">
          <div className="flex items-center mb-4">
            <div className="text-white text-2xl font-semibold">Friends</div>
            <button
              className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
              onClick={toggleModal}
            >
              Add
            </button>
            <button className="bg-gray-800 text-gray-300 px-2 py-1 ml-2 rounded">
              <Link to="/main">Online</Link>
            </button>
            <button className="bg-gray-500 text-gray-300 px-2 py-1 ml-2 rounded hover:bg-gray-600">
              <Link to="/main/friend/pending">Pending</Link>
            </button>
            <button className="bg-gray-500 text-gray-300 px-2 py-1 ml-2 rounded hover:bg-gray-600">
              <Link to="/main/friend/blocked">Blocked</Link>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              className="bg-gray-600 text-white w-full h-10 pl-3 pr-10 rounded-md"
              placeholder="Search"
            />
            <BsSearch className="absolute right-3 top-2 text-white" />
          </div>
          <div className="text-white font-semibold mt-4">
            Online - {onlineFriends.length}
          </div>
          <div className="flex flex-col mt-2">
            {onlineFriends
              ? onlineFriends.map((friendOnline) => (
                  <div
                    key={friendOnline.id}
                    className="bg-gray-800 w-full h-16 flex items-center p-4 mb-2 rounded-md"
                  >
                    <img
                      src={
                        actualUserId == friendOnline.user.id
                          ? friendOnline.friend.avatar
                            ? friendOnline.friend.avatar
                            : "/image.jpg"
                          : friendOnline.user.avatar
                          ? friendOnline.user.avatar
                          : "/image.jpg"
                      }
                      alt={
                        actualUserId == friendOnline.user.id
                          ? friendOnline.friend.pseudo
                          : friendOnline.user.pseudo
                      }
                      className="w-12 h-12 rounded-full mr-4"
                    />

                    <div className="text-white font-semibold">
                      {actualUserId == friendOnline.user.id
                        ? friendOnline.friend.pseudo
                        : friendOnline.user.pseudo}
                    </div>
                    <div className="ml-auto">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button className="flex items-center justify-center w-full shadow-sm px-2 py-2 text-sm font-medium text-gray-700 focus:outline-none">
                          <Link
                            to={`/friend/message/${
                              actualUserId == friendOnline.user.id
                                ? friendOnline.friend.id
                                : friendOnline.user.id
                            }`}
                          >
                            <TbMessageCircle2Filled className="text-white w-8 h-8 p-1 rounded-full bg-gray-700 mr-4" />
                          </Link>
                          <HiOutlineDotsVertical className="text-white w-8 h-8 p-1 rounded-full bg-gray-700 hover:bg-gray-600" />
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
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-gray-600 text-gray-700 focus:outline-none">
                            <div className="py-1 bg-gray-600 rounded-lg">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-gray-400 text-black"
                                        : "text-black"
                                    } flex px-2 py-1 text-sm bg-gray-600 text-red-500 rounded-md w-full`}
                                    onClick={() =>
                                      deleteFriend(
                                        actualUserId == friendOnline.user.id
                                          ? friendOnline.friend.wallet_address
                                          : friendOnline.user.wallet_address
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
                                        ? "bg-gray-400 text-black"
                                        : "text-black"
                                    } flex px-2 py-1 text-sm bg-gray-600 text-black rounded-md w-full`}
                                    onClick={() =>
                                      blockFriend(
                                        actualUserId == friendOnline.user.id
                                          ? friendOnline.friend.wallet_address
                                          : friendOnline.user.wallet_address
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
