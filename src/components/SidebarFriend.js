import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";

const baseURL = "http://localhost:8080";

const SidebarFriend = ({ friendId }) => {
  const [currentFriendId, setCurrentFriendId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [actualUserId, setActualUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentFriendId(friendId);
    const user = JSON.parse(localStorage.getItem("user"));
    setActualUserId(user.id);
    const fetchFriends = async () => {
      const accessToken = localStorage.getItem("accessToken");
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
            const user = friendRequest.user;
            let friendAvatar, userAvatar;
  
            try {
              const friendAvatarResponse = await axios.get(
                `${baseURL}/static${friend.avatar}`,
                {
                  responseType: "blob",
                }
              );
              friendAvatar = URL.createObjectURL(friendAvatarResponse.data);
            } catch (err) {
              friendAvatar = "";
            }
  
            try {
              const userAvatarResponse = await axios.get(
                `${baseURL}/static${user.avatar}`,
                {
                  responseType: "blob",
                }
              );
              userAvatar = URL.createObjectURL(userAvatarResponse.data);
            } catch (err) {
              userAvatar = "";
            }
  
            return {
              ...friendRequest,
              friend: { ...friend, avatar: friendAvatar },
              user: { ...user, avatar: userAvatar },
            };
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
        {friends.map((friend) => {
          const displayFriend =
            actualUserId === friend.friend.id ? friend.user : friend.friend;

          return (
            <Link to={`/friend/message/${displayFriend.id}`}>
              <div
                key={friend.id}
                className={`${
                  displayFriend.id === currentFriendId
                    ? "bg-gray-600"
                    : "bg-gray-800 hover:bg-gray-600"
                } w-full h-16 flex items-center p-4 rounded-md transition-colors duration-300`}
                onClick={() => setCurrentFriendId(displayFriend.id)}
              >
                <img
                  src={actualUserId == friend.user.id
                    ? friend.friend.avatar
                      ? friend.friend.avatar
                      : "/image.jpg"
                    : friend.user.avatar
                    ? friend.user.avatar
                    : "/image.jpg"}
                  alt={actualUserId == friend.user.id ? friend.friend.pseudo : friend.user.pseudo}
                  className="w-12 h-12 rounded-full mr-4"
                />

                <div className="text-white font-semibold">
                  {displayFriend.pseudo}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarFriend;
