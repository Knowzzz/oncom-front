import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "react-toastify";

const baseURL = "http://localhost:8080";

const SearchModal = ({ isOpen, closeModal }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [foundProfiles, setFoundProfiles] = useState(null);
  const [activeContextMenu, setActiveContextMenu] = useState(null);

  useEffect(() => {
    return () => {
      if (foundProfiles) {
        foundProfiles.forEach((profile) => {
          if (profile.avatar) {
            URL.revokeObjectURL(profile.avatar);
          }
        });
      }
    };
  }, [foundProfiles]);

  const addFriend = async (friend_wallet_address) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `${baseURL}/api/friend/add`,
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
        toast.success("Successfully added", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        closeModal();
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const handleSearch = async (event) => {
    setWalletAddress(event);

    async function getFriend() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`${baseURL}/api/user/get/prefix`, {
          params: {
            userId: user.id,
            take: 5,
            prefix: walletAddress,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        const usersWithAvatars = await Promise.all(
          response.data.users.map(async (user) => {
            try {
              const avatarResponse = await axios.get(
                `${baseURL}/static${user.avatar}`,
                {
                  responseType: "blob",
                }
              );
              const avatarUrl = URL.createObjectURL(avatarResponse.data);
              return { ...user, avatar: avatarUrl };
            } catch (err) {
              console.log(err);
              return user;
            }
          })
        );
        setFoundProfiles(usersWithAvatars);
      } catch (err) {
        console.log(err);
        return err;
      }
    }
    await getFriend();
    setActiveContextMenu(null);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zizc-800 bg-opacity-50 z-50">
      <div className="bg-zinc-600 w-1/3 h-2/3 rounded-lg flex flex-col items-center p-6">
        <h2 className="text-white text-2xl font-semibold mb-4">
          Recherchez un utilisateur par adresse de portefeuille
        </h2>
        <input
          type="text"
          className="bg-zinc-500 text-white w-full h-10 pl-3 pr-10 rounded-md mb-4"
          placeholder="Adresse du portefeuille"
          value={walletAddress}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {foundProfiles &&
          foundProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-zinc-500 w-full h-14 p-1 m-2 rounded-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={profile.avatar ? profile.avatar : "/image.jpg"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-600"
                />
                <p className="text-white font-semibold ml-6">
                  {profile.pseudo}
                </p>
              </div>
              <div className="relative">
                <HiOutlineDotsVertical
                  className="text-white cursor-pointer"
                  onClick={() => {
                    setActiveContextMenu(
                      activeContextMenu === profile.id ? null : profile.id
                    );
                  }}
                />
                {activeContextMenu === profile.id && (
                  <div className="bg-zinc-600 rounded-lg p-2 absolute right-0">
                    <button
                      className="bg-zinc-500 hover:bg-zinc-400 text-green-500 w-full p-1 rounded-md"
                      onClick={() => addFriend(profile.wallet_address)}
                    >
                      Add Friend
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        <button
          className="bg-red-500 text-white px-4 py-2 mt-auto rounded-md"
          onClick={closeModal}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default SearchModal;