import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLastChannelId } from "../../features/userSlice";

import SidebarChannel from "../../components/SidebarChannel";
import SidebarServers from "../../components/SidebarServers";
import SidebarUserOnDao from "../../components/SidebarUserOnDao";

const baseURL = "http://localhost:8080";

const Dao = () => {
  const { daoId } = useParams();
  const [currentDaoId, setCurrentDaoId] = useState(null);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const lastChannelId = useSelector((state) => state.user.lastChannelId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentDaoId(daoId);
    if (lastChannelId) { setCurrentChannelId(lastChannelId) }

    const fetchDaoData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userId = JSON.parse(localStorage.getItem("user")).id;

      const response = await axios.get(`${baseURL}/api/dao/getOne`, {
        params: {
          daoId: currentDaoId,
          userId: userId,
        },
        headers: {
          "x-access-token": accessToken,
        },
      });

      if (lastChannelId) {
        setCurrentChannelId(lastChannelId);
      } else {
        setCurrentChannelId(response.data.dao.channels[0].id)
      }

      dispatch(setLastChannelId(currentChannelId));
      console.error(
        "Error fetching DAO data:",
        response.status,
        response.statusText
      );
    };

    if (currentDaoId) {
      fetchDaoData();
    }
  }, [currentDaoId, lastChannelId, dispatch, daoId]);

  const handleSend = () => {
    console.log("Sending message...");
  };

  return (
    <div className="h-screen w-screen bg-gray-800 text-white flex">
      <SidebarServers />
      <SidebarChannel daoId={currentDaoId} channelId={currentChannelId} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-700 px-4 py-2 overflow-y-auto">
          {/* Add your messaging UI components here */}
        </div>
        <div
          className="flex items-center px-4 py-2 bg-gray-600"
        >
          <input
            type="text"
            className="bg-gray-500 text-white w-full p-2 rounded-md"
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSend();
              }
            }}
            autoComplete="off"
          />
        </div>
      </div>
      <SidebarUserOnDao daoId={currentDaoId} />
    </div>
  );
};

export default Dao;
