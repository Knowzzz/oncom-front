import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { setActualFriendMessageId } from '../features/userSlice';

const baseURL = "http://localhost:8080";

const SidebarFriend = ({ friendId, allFriends, setActiveContent, currentFriendId, setCurrentFriendId }) => {
  const [friends, setFriends] = useState(allFriends);
  const [actualUserId, setActualUserId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();

  useEffect(() => {
    setActualUserId(user.id);
    setFriends(allFriends);
  }, [friendId, allFriends]);

  const handleChangeFriendMessage = (nextFriendId) => {
    dispatch(setActualFriendMessageId(nextFriendId));
    setActiveContent("Messages");
  }

  return (
    <div className="bg-zinc-800 w-64 flex flex-col py-4 border border-zinc-600 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col mb-4 space-y-1">
        <button
          className={`${currentFriendId != null ? "bg-zinc-800" : "bg-zinc-600"
            } hover:bg-zinc-500 text-white font-semibold rounded-t w-full py-2 focus:outline-none flex items-center px-4`}
          onClick={() => {
            setCurrentFriendId(null);
            setActiveContent("FriendOnline")
          }}
        >
          <FaUserPlus className="mr-2" />
          Amis
        </button>
        <button
          className={`bg-zinc-800 hover:bg-zinc-500 text-gray-300 font-semibold rounded-b w-full py-2 focus:outline-none flex items-center px-4`}
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
        {friends && friends.map((friend) => {
          const displayFriend =
            actualUserId === friend.friend.id ? friend.user : friend.friend;

          return (
            <button onClick={() => handleChangeFriendMessage()} key={friend.id}>
              <div
                
                className={`${displayFriend.id == currentFriendId
                    ? "bg-zinc-600"
                    : "bg-zinc-800 hover:bg-zinc-700"
                  } w-full h-16 flex items-center p-4 rounded-md transition-colors duration-300`}
                onClick={() => setCurrentFriendId(displayFriend.id)}
              >
                <img
                  src={
                    actualUserId == friend.user.id
                      ? friend.friend.avatar
                        ? friend.friend.avatar
                        : "/image.jpg"
                      : friend.user.avatar
                        ? friend.user.avatar
                        : "/image.jpg"
                  }
                  alt={
                    actualUserId == friend.user.id
                      ? friend.friend.pseudo
                      : friend.user.pseudo
                  }
                  className="w-12 h-12 rounded-full mr-4"
                />

                <div className="text-white font-semibold">
                  {displayFriend.pseudo}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarFriend;
