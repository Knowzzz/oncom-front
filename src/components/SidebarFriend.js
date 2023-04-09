import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";


const baseURL = "http://localhost:8080";


const SidebarFriend = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const result = await axios.get(`${baseURL}/api/friend/getAll`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setFriends(result.data);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="bg-gray-800 w-64 flex flex-col py-4">
      <div className="flex flex-col mb-4 space-y-1">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-t w-full py-2 focus:outline-none flex items-center px-4"
          onClick={() => navigate("/friends")}
        >
          <FaUserPlus className="mr-2" />
          Amis
        </button>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-b w-full py-2 focus:outline-none flex items-center px-4"
          onClick={() => navigate("/similar")}
        >
          <TbSquareRoundedPlusFilled className="mr-2" />
          Similar+
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <p className="text-gray-400 text-sm text-center font-semibold">Message privé</p>
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="bg-gray-800 hover:bg-gray-700 w-full h-16 flex items-center p-4 rounded-md transition-colors duration-300"
          >
            <img
              src={friend.avatar}
              alt={friend.username}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="text-white font-semibold">{friend.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default SidebarFriend;
