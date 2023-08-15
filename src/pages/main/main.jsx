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
  LoadingSidebarFriendsSkeleton,
  LoadingUserProfileSkeleton,
} from "../../components/LoadingSkeleton";
import UserProfile from "../../components/UserProfile";
import { ethers } from "ethers";
import { JSON_RPC_URL } from "../../components/const";
import FriendMessage from "../message/FriendMessage";
import FriendProfile from "../message/FriendProfile";
import { useDispatch, useSelector } from 'react-redux';
import { setActualFriendMessageId } from '../../features/userSlice';

const MainContent = ({
  activeContent,
  setActiveContent,
  friendData,
  setFriendData,
  actualUserId,
  setActualUserId,
  onlineFriends,
  pendingFriends,
  blockedFriends,
  currentFriendId,
  setCurrentFriendId
}) => {
  switch (activeContent) {
    case "FriendOnline":
      return (
        <FriendOnline
          onlineFriends={onlineFriends}
          setFriendData={setFriendData}
          actualUserId={actualUserId}
          setActualUserId={setActualUserId}
          setCurrentFriendId={setCurrentFriendId}
          setActiveContent={setActiveContent}
        />
      );
    case "BlockFriend":
      return <Blockfriend blockedFriends={blockedFriends} />;
    case "Pending":
      return <Pending pendingFriends={pendingFriends} />;
    case "Messages":
      return <FriendMessage currentFriendId={currentFriendId} setCurrentFriendId={setCurrentFriendId} />
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
  const friendId = useSelector(state => state.user.actualFriendMessageId);
  const [currentFriendId, setCurrentFriendId] = useState(friendId);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const changeFriendId = (friendId) => {
    setCurrentFriendId(friendId);
    dispatch(setActualFriendMessageId(friendId));
  }

  useEffect(() => {
    setCurrentFriendId(friendId);
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

        

        setFriendOnlineData(result.data.onlineFriends);
        setFriendPendingData(result.data.friendRequests);
        setFriendBlockedData(result.data.blockedFriends);
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
      {!friendsLoading !== null && friendOnlineData !== null ? (
        <SidebarFriend setCurrentFriendId={setCurrentFriendId} allFriends={friendOnlineData} setActiveContent={setActiveContent} currentFriendId={currentFriendId} />
      ) : (
        <LoadingSidebarFriendsSkeleton />
      )}
      <div className={`bg-zinc-700 flex flex-col flex-grow ${activeContent !== "Messages" && "p-6"}`}>
        {activeContent === "Messages" ? (null)
          : (
            <div className="flex items-center mb-4">
              <div className="text-white text-2xl font-semibold">Friends</div>
              <button
                className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
                onClick={toggleModal}
              >
                Add
              </button>
              <button
                className={`px-2 py-1 ml-2 rounded ${activeContent === "FriendOnline"
                  ? "bg-zinc-800 text-gray-300"
                  : "bg-zinc-500 text-gray-300 hover:bg-zinc-600"
                  }`}
                onClick={() => setActiveContent("FriendOnline")}
              >
                Online
              </button>
              <button
                className={`px-2 py-1 ml-2 rounded ${activeContent === "Pending"
                  ? "bg-zinc-800 text-gray-300"
                  : "bg-zinc-500 text-gray-300 hover:bg-zinc-600"
                  }`}
                onClick={() => setActiveContent("Pending")}
              >
                Pending
              </button>
              <button
                className={`px-2 py-1 ml-2 rounded ${activeContent === "BlockFriend"
                  ? "bg-zinc-800 text-gray-300"
                  : "bg-zinc-500 text-gray-300 hover:bg-zinc-600"
                  }`}
                onClick={() => setActiveContent("BlockFriend")}
              >
                Blocked
              </button>
            </div>
          )}

        {!friendsLoading !== null && friendData !== null && friendBlockedData !== null && friendOnlineData !== null && friendPendingData !== null ? (
          <MainContent
            activeContent={activeContent}
            setActiveContent={setActiveContent}
            onlineFriends={friendOnlineData}
            actualUserId={actualUserId}
            setActualUserId={setActualUserId}
            pendingFriends={friendPendingData}
            blockedFriends={friendBlockedData}
            currentFriendId={currentFriendId}
            setCurrentFriendId={changeFriendId}
          />
        ) : (
          <LoadingFriendsSkeleton />
        )}

        <SearchModal isOpen={isModalOpen} closeModal={toggleModal} />
      </div>
      {activeContent !== "Messages" && (
        !userProfileLoading && user ? (
          <UserProfile
            user={user}
            avatarUrl={avatarUrl}
            setNewAvatar={setNewAvatar}
            setUser={setUser}
            newAvatar={newAvatar}
          />
        ) : (
          <LoadingUserProfileSkeleton />
        )
      )}
      {activeContent == "Messages" ? (
        <FriendProfile currentFriendId={currentFriendId} />
      ) : null}
    </div>
  );
};

export default Main;
