import React, { useState, useEffect } from "react";
import axios from "axios";

const baseURL = "http://localhost:8080";

const FriendProfile = ({ friendId }) => {
  const [friend, setFriend] = useState({
    wallet_address: "",
    pseudo: "",
    avatar: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  //const [sharedDaos, setSharedDaos] = useState([]);

  useEffect(() => {
    let isMounted = true;
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
        if (isMounted) {
          setFriend(response.data.user);
          setAvatarUrl(`${baseURL}/static${response.data.user.avatar}`);
          // TODO: Fetch shared DAOs and update the state.
        }
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
    <div className="bg-zinc-800 border border-zinc-600 w-1/6 flex flex-col p-4">
      <div className="flex justify-center">
        <img
          src={avatarUrl || "/image.jpg"}
          alt="Profile"
          className="w-24 h-24 rounded-full cursor-pointer border-2 border-zinc-700"
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
          className="bg-zinc-600 text-white w-full p-2 rounded-md mt-2"
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
          className="bg-zinc-600 text-white w-full p-2 rounded-md mt-2"
        />
      </div>
      {/* Add the shared DAOs section here */}
    </div>
  );
};

export default FriendProfile;
