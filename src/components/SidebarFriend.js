import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";

const baseURL = "http://localhost:8080";

const SidebarFriend = ({ friendId }) => {
  const [currentFriendId, setCurrentFriendId] = useState(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentFriendId(friendId);
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

        const friendsWithAvatars = await Promise.all(
          result.data.friends.map(async (friendRequest) => {
            const friend = friendRequest.friend; // <-- Change this line
            try {
              const avatarResponse = await axios.get(
                `${baseURL}/static/images/user/user-${friend.id}.png`,
                {
                  responseType: "blob",
                }
              );
              const avatarUrl = URL.createObjectURL(avatarResponse.data);
              return {
                ...friendRequest,
                friend: { ...friend, avatar: avatarUrl },
              };
            } catch (err) {
              console.log(err);
              return { ...friendRequest, friend: { ...friend, avatar: "" } };
            }
          })
        );
        setFriends(friendsWithAvatars);
      } catch (err) {
        return err;
      }
    };

    fetchFriends();
  }, [friendId]);

  return (
    <div className="bg-gray-800 w-64 flex flex-col py-4 border border-gray-500">
      <div className="flex flex-col mb-4 space-y-1">
        <button
          className={`${
            currentFriendId != null ? "bg-gray-800" : "bg-gray-600"
          } hover:bg-gray-600 text-white font-semibold rounded-t w-full py-2 focus:outline-none flex items-center px-4`}
          onClick={() => {
            setCurrentFriendId(null);
            navigate("/friends");
          }}
        >
          <FaUserPlus className="mr-2" />
          Amis
        </button>
        <button
          className={`bg-gray-800 hover:bg-gray-600 text-gray-300 font-semibold rounded-b w-full py-2 focus:outline-none flex items-center px-4`}
          onClick={() => navigate("/similar")}
        >
          <TbSquareRoundedPlusFilled className="mr-2" />
          Similar+
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <p className="text-gray-400 text-sm text-center font-semibold">
          Message privé
        </p>
        {friends.map((friend) => (
          <Link to={`/friend/message/${friend.friend.id}`}>
            <div
              key={friend.id}
              className={`${
                friend.friend.id == currentFriendId
                  ? "bg-gray-600"
                  : "bg-gray-800 hover:bg-gray-600"
              } w-full h-16 flex items-center p-4 rounded-md transition-colors duration-300`}
              onClick={() => setCurrentFriendId(friend.friend.id)}
            >
              <img
                src={friend.friend.avatar}
                alt={friend.friend.pseudo}
                className="w-12 h-12 rounded-full mr-4"
              />

              <div className="text-white font-semibold">
                {friend.friend.pseudo}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarFriend;
