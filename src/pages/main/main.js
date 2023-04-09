import React, { useState, useEffect } from "react";
import SidebarServers from "../../components/SidebarServers";
import SidebarFriend from "../../components/SidebarFriend";
import axios from "axios";
import { BsSearch, BsFillChatFill } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";

const baseURL = "http://localhost:8080";

const UserProfile = () => {
  const [user, setUser] = useState({
    wallet_address: "",
    pseudo: "",
    avatar: "",
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const updateUser = async (userId, pseudo, wallet_address, avatar) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("pseudo", pseudo);
      formData.append("wallet_address", wallet_address);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.post(
        `${baseURL}/api/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": accessToken,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        window.location.reload();
      } else {
        console.log("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await updateUser(user.id, user.pseudo, user.wallet_address, newAvatar);
    } catch (error) {
      console.error(error);
    }
  };

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
        setAvatarUrl(buildImageUrl(response.data.user.avatar));
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


  const isBlobUrl = (url) => {
    return url && url.startsWith("blob:");
  };

  const buildImageUrl = (relativePath) => {
    if (isBlobUrl(relativePath)) {
      return relativePath;
    }
    return `${baseURL}/static${relativePath}`;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-700 border border-gray-500 w-1/4 flex flex-col p-4">
      <div className="flex justify-center">
        <label htmlFor="avatar">
          <img
            src={user.avatar ? buildImageUrl(user.avatar) : "/image.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full cursor-pointer border-2 border-gray-600"
          />
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={(event) => {
            console.log("File input onChange triggered");
            setNewAvatar(event.target.files[0]);
            const newAvatarUrl = URL.createObjectURL(event.target.files[0]);
            console.log("New avatar URL:", newAvatarUrl);
            setUser({
              ...user,
              avatar: newAvatarUrl,
            });
          }}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="username" className="text-white font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.pseudo || ""}
            onChange={handleChange}
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
            value={user.wallet_address}
            onChange={handleChange}
            className="bg-gray-600 text-white w-full p-2 rounded-md mt-2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2 rounded-md mt-4"
        >
          Valider
        </button>
      </form>
    </div>
  );
};

const MainPage = () => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const addFriend = (walletAddress) => {
    // Ajoutez ici la logique pour ajouter un ami en utilisant l'adresse du portefeuille
    console.log("Adding friend with wallet address:", walletAddress);
    closeModal();
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const result = await axios.get(`${baseURL}/api/friend/getAll/online`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setOnlineFriends(result.data);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="bg-gray-800 h-screen w-screen">
      <div className="flex h-full">
        <SidebarServers />
        <SidebarFriend />
        <div className="bg-gray-700 w-full flex flex-col p-6 flex-grow">
          <div className="flex items-center mb-4">
            <div className="text-white text-2xl font-semibold">Friends</div>
            <button
              className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
              onClick={toggleModal}
            >
              Add
            </button>
            <button
              className="bg-gray-600 text-white px-2 py-1 ml-2 rounded"
              onClick={() => navigate("/friend/online")}
            >
              Online
            </button>
            <button
              className="bg-gray-500 text-gray-300 px-2 py-1 ml-2 rounded"
              onClick={() => navigate("/friend/pending")}
            >
              Pending
            </button>
            <button
              className="bg-gray-500 text-gray-300 px-2 py-1 ml-2 rounded"
              onClick={() => navigate("/friend/blocked")}
            >
              Blocked
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
          <div className="text-white font-semibold mt-4">Online</div>
          <div className="flex flex-col mt-2">
            {onlineFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-gray-800 w-full h-16 flex items-center p-4 mb-2 rounded-md"
              >
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="text-white font-semibold">
                  {friend.username}
                </div>
                <HiOutlineDotsVertical className="ml-4 text-white" />
              </div>
            ))}
          </div>
        </div>
        <UserProfile />
        <SearchModal isOpen={isModalOpen} closeModal={toggleModal} />
      </div>
    </div>
  );
};

export default MainPage;
