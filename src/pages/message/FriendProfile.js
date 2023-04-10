import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const baseURL = "http://localhost:8080";

const FriendProfile = ({ friendId }) => {
  const [friend, setFriend] = useState({
    wallet_address: "",
    pseudo: "",
    avatar: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [sharedDaos, setSharedDaos] = useState([]);
  const [messages, setMessages] = useState([
    // Example messages
    {
      messageId: 1,
      messageContent: "Salut !",
      messageWriter: "Alice",
      messageDate: "2023-04-10",
    },
    {
      messageId: 2,
      messageContent: "Salut, comment ça va ?",
      messageWriter: "Bob",
      messageDate: "2023-04-10",
    },
  ]);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/api/user/get/special`, {
          params: {
            userId: JSON.parse(localStorage.getItem("user")).id,
            user_id: friendId,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setFriend(response.data.user);
        setAvatarUrl(`${baseURL}/static${response.data.user.avatar}`);
        // TODO: Fetch shared DAOs and update the state.
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriendProfile();
  }, [friendId]);

  if (!friend) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-700 border border-gray-500 w-1/4 flex flex-col p-4">
      <div className="flex justify-center">
        <img
          src={avatarUrl || "/image.jpg"}
          alt="Profile"
          className="w-24 h-24 rounded-full cursor-pointer border-2 border-gray-600"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="username" className="text-white font-semibold">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={friend.pseudo || ""}
          readOnly
          className="bg-gray-600 text-white w-full p-2 rounded-md mt-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="address" className="text-white font-semibold">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={friend.wallet_address}
          readOnly
          className="bg-gray-600 text-white w-full p-2 rounded-md mt-2"
        />
      </div>
      {/* Add the shared DAOs section here */}
    </div>
  );
};

export default FriendProfile;
