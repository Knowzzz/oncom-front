import Pending from "./MainContent/Pending";
import SidebarFriend from "../../components/SidebarFriend";
import SidebarServers from "../../components/SidebarServers";
import Blockfriend from "./MainContent/Blockfriend";
import SearchModal from "./SearchModal";
import FriendOnline from "./MainContent/Online";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { baseURL } from "../../components/const";
import "../../components/style.css";
import {
  LoadingFriendsSkeleton,
  LoadingUserProfileSkeleton,
} from "../../components/LoadingSkeleton";
import UserProfile from "../../components/UserProfile";
import { ethers } from "ethers";
import { JSON_RPC_URL } from "../../components/const";

const MainContent = ({
  activeContent,
  setActiveContent,
  friendData,
  setFriendData,
  actualUserId,
  setActualUserId,
  onlineFriends,
  pendingFriends,
  blockedFriends
}) => {
  switch (activeContent) {
    case "FriendOnline":
      return (
        <FriendOnline
          onlineFriends={onlineFriends}
          setFriendData={setFriendData}
          actualUserId={actualUserId}
          setActualUserId={setActualUserId}
        />
      );
    case "BlockFriend":
      return <Blockfriend blockedFriends={blockedFriends} />;
    case "Pending":
      return <Pending pendingFriends={pendingFriends}/>;
    default:
      return (
        <FriendOnline
          friendData={friendData}
          setFriendData={setFriendData}
          actualUserId={actualUserId}
          setActualUserId={setActualUserId}
        />
      );
  }
};

const Main = () => {
  const [activeContent, setActiveContent] = useState("FriendOnline");
  const [friendData, setFriendData] = useState();
  const [friendOnlineData, setFriendOnlineData] = useState();
  const [friendPendingData, setFriendPendingData] = useState();
  const [friendBlockedData, setFriendBlockedData] = useState();
  const [actualUserId, setActualUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(!friendData);
  const [userProfileLoading, setUserProfileLoading] = useState(!friendData);
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [user, setUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`${baseURL}/api/user/get`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setUser(response.data.user);
        const avatarResponse = await fetch(
          `${baseURL}/static${response.data.user.avatar}`
        );
        const avatarBlob = await avatarResponse.blob();
        setAvatarUrl(URL.createObjectURL(avatarBlob));
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        console.log(error);
        return error;
      }
      if (newAvatar) {
        setAvatarUrl(URL.createObjectURL(newAvatar));
      }
    };
    fetchUser();
  }, [newAvatar]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (friendData) {
      setFriendsLoading(false);
    } else {
      setFriendsLoading(true);
    }

    if (user) {
      setUserProfileLoading(false);
    } else {
      setUserProfileLoading(true);
    }
  }, [friendData, user]);

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


        const fetchAvatars = async (friends) => {
            return await Promise.all(
              friends.map(async friend => {
                const friendAvatarPath = actualUserId === friend.user.id 
                  ? friend.user.avatar 
                  : friend.friend.avatar;
          
                const response = await axios.get(`${baseURL}/static/${friendAvatarPath}`, {
                  responseType: 'arraybuffer'
                });
          
                const image = new Blob([response.data], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(image);
                
                return {
                  ...friend,
                  user: { ...friend.user, avatar: actualUserId === friend.user.id ? imageUrl : friend.user.avatar },
                  friend: { ...friend.friend, avatar: actualUserId === friend.user.id ? friend.friend.avatar : imageUrl }
                };
              })
            );
          };
          
        const onlineFriendsWithAvatars = await fetchAvatars(result.data.onlineFriends);
        const blockedFriendsWithAvatars = await fetchAvatars(result.data.blockedFriends);
        const friendRequestsWithAvatars = await fetchAvatars(result.data.friendRequests);

        setFriendOnlineData(onlineFriendsWithAvatars);
        setFriendPendingData(friendRequestsWithAvatars);
        setFriendBlockedData(blockedFriendsWithAvatars);
        setFriendData(result.data);
        setFriendsLoading(false);
      } catch (err) {
        console.log(err)
        return err;
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="bg-zinc-700 h-screen w-screen flex h-full">
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
          <button
            className={`px-2 py-1 ml-2 rounded ${
              activeContent === "FriendOnline"
                ? "bg-zinc-800 text-gray-300"
                : "bg-zinc-500 text-gray-300 hover:bg-zinc-600"
            }`}
            onClick={() => setActiveContent("FriendOnline")}
          >
            Online
          </button>
          <button
            className={`px-2 py-1 ml-2 rounded ${
              activeContent === "Pending"
                ? "bg-zinc-800 text-gray-300"
                : "bg-zinc-500 text-gray-300 hover:bg-zinc-600"
            }`}
            onClick={() => setActiveContent("Pending")}
          >
            Pending
          </button>
          <button
            className={`px-2 py-1 ml-2 rounded ${
              activeContent === "BlockFriend"
                ? "bg-zinc-800 text-gray-300"
                : "bg-zinc-500 text-gray-300 hover:bg-zinc-600"
            }`}
            onClick={() => setActiveContent("BlockFriend")}
          >
            Blocked
          </button>
        </div>
        {!friendsLoading && friendData && friendBlockedData && friendOnlineData && friendPendingData ? (
          <MainContent
            activeContent={activeContent}
            setActiveContent={setActiveContent}
            onlineFriends={friendOnlineData}
            actualUserId={actualUserId}
            setActualUserId={setActualUserId}
            pendingFriends={friendPendingData}
            blockedFriends={friendBlockedData}
          />
        ) : (
          <LoadingFriendsSkeleton />
        )}

        <SearchModal isOpen={isModalOpen} closeModal={toggleModal} />
      </div>
      {!userProfileLoading && user ? (
        <UserProfile
          user={user}
          avatarUrl={avatarUrl}
          setNewAvatar={setNewAvatar}
          setUser={setUser}
          newAvatar={newAvatar}
        />
      ) : (
        <LoadingUserProfileSkeleton />
      )}
    </div>
  );
};

export default Main;
