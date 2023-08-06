import { BsSearch } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { LoadingFriendsSkeleton } from "../../../components/LoadingSkeleton";
import { baseURL } from "../../../components/const";
import { Fragment } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FriendOnline = ({
  onlineFriends,
  actualUserId,
  setActualUserId,
  setActiveContent,
  setCurrentFriendId,
}) => {
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

  return (
    <div>
      {onlineFriends !== null ? (
        <div>
          <div className="relative">
            <input
              type="text"
              name="searchfriend"
              autoComplete="off"
              className="bg-zinc-600 text-white w-full h-10 pl-3 pr-10 rounded-md"
              placeholder="Search"
            />
            <BsSearch className="absolute right-3 top-2 text-white" />
          </div>

          {onlineFriends ? (<div className="text-white font-semibold mt-4">
            Online - {onlineFriends.length}
          </div>) : (<div className="text-white font-semibold mt-4">
            Online - 0
          </div>)}


          {onlineFriends
            ? onlineFriends.map((friendOnline) => (
              <div
                key={friendOnline.id}
                className="bg-zinc-800 w-full h-16 flex items-center p-4 mb-2 rounded-md"
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
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center justify-center w-full shadow-sm px-2 py-2 text-sm font-medium text-gray-700 focus:outline-none">
                      <button
                        onClick={() => {
                          setCurrentFriendId(
                            actualUserId == friendOnline.user.id
                              ? friendOnline.friend.id
                              : friendOnline.user.id
                          );
                          setActiveContent("Messages");
                        }}
                      >
                        <TbMessageCircle2Filled className="text-white w-8 h-8 p-1 rounded-full bg-zinc-700 mr-4" />
                      </button>
                      <HiOutlineDotsVertical className="text-white w-8 h-8 p-1 rounded-full bg-zinc-700 hover:bg-zinc-600" />
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
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-zinc-600 text-gray-700 focus:outline-none">
                        <div className="py-1 bg-zinc-600 rounded-lg">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${active
                                    ? "bg-zinc-400 text-black"
                                    : "text-black"
                                  } flex px-2 py-1 text-sm bg-zinc-600 text-red-500 rounded-md w-full`}
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
                                className={`${active
                                    ? "bg-zinc-400 text-black"
                                    : "text-black"
                                  } flex px-2 py-1 text-sm bg-zinc-600 text-black rounded-md w-full`}
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
      ) : (
        <LoadingFriendsSkeleton />
      )}
    </div>
  );
};

export default FriendOnline;
