import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLastChannelId } from "../../features/userSlice";
import { io } from "socket.io-client";
import SidebarChannel from "./SidebarChannel";
import SidebarServers from "../../components/SidebarServers";
import SidebarUserOnDao from "../../components/SidebarUserOnDao";
import { BsThreeDots } from "react-icons/bs";
import Modal from "react-modal";

const baseURL = "http://localhost:8080";

const Channel = () => {
  const { daoId, channelId } = useParams();
  const [currentDaoId, setCurrentDaoId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [messages, setMessages] = useState([]);
  const [canWriteMessage, setCanWriteMessage] = useState(true);
  const [userAvatars, setUserAvatars] = useState({});
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const socket = io(`${baseURL}/channel-message`, {
    query: { userId, channelId, daoId },
  });

  function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank">${url}</a>`
    );
  }

  useEffect(() => {
    if (!daoId || !channelId) { return }
    socket.on("initial-messages", ({ messages, canWriteMessage }) => {
      setMessages(messages);
      setCanWriteMessage(canWriteMessage);
    });

    socket.on("new-message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  

    setCurrentDaoId(daoId);

    const fetchDaoData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      dispatch(setLastChannelId({ daoId: daoId, channelId: channelId }));
    };

    if (currentDaoId) {
      fetchDaoData();
    }

    return () => {
      if (socket) {
        socket.off("initial-messages");
        socket.off("new-message");
      }
    };
  }, [channelId, dispatch, daoId]);

  useEffect(() => {
    messages.forEach(async (message) => {
      if (!userAvatars[message.user.id]) {
        await getAvatarUrl(message.user.id, message.user.avatar);
      }
    });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (inputMessage.trim() === "") return;

    try {
      if (socket) {
        socket.emit("new-message", {
          userId: userId,
          channelId: channelId,
          content: inputMessage,
          daoId: daoId,
        });

        setInputMessage("");
      }
    } catch (error) {
      return error;
    }
  };

  const getAvatarUrl = async (userId, avatarPath) => {
    if (userAvatars[userId]) {
      return userAvatars[userId];
    }

    try {
      const response = await axios.get(`${baseURL}/static/${avatarPath}`);

      setUserAvatars((prevAvatars) => ({
        ...prevAvatars,
        [userId]: response.config.url,
      }));

      return response.config.url;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-700 text-white flex">
      <SidebarServers />
      <SidebarChannel daoId={currentDaoId} channelId={channelId} />
      <div className="flex-1 flex flex-col bg-zinc-700">
        <div className="flex-1 bg-zinc-700 px-4 py-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                index > 0 && messages[index - 1].user.id === message.user.id
                  ? ""
                  : ""
              }`}
              onMouseEnter={() => setHoveredMessage(index)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div
                className={`${
                  hoveredMessage === index ? "bg-gray-600" : "bg-gray-700"
                } px-1 py-0.5 w-full relative text-gray-300`}
                  hoveredMessage === index ? "bg-zinc-600" : "bg-zinc-700"
                } px-1 flex flex-col`}
              >
                {index === 0 ||
                messages[index - 1].user.id !== message.user.id ? (
                  <div className="flex items-center">
                    <img
                      src={userAvatars[message.user.id] || ""}
                      alt={`${message.user.pseudo}'s avatar`}
                      className="w-10 h-10 rounded-full mr-4 mt-4"
                    />
                    {message.user.pseudo}
                  </div>
                ) : null}
                <div
                  className={`${
                    hoveredMessage === index ? "bg-zinc-600" : "bg-zinc-700"
                  } px-10 w-full relative text-gray-300 pl-14`}
                >
                  {message.content}
                  {hoveredMessage === index && (
                    <BsThreeDots
                      className="absolute top-1 right-2 text-xl hover:border hover:border-gray-500 hover:bg-zinc-600 hover:shadow-xl rounded-full"
                      onClick={() => setShowModal(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <input
          type="text"
          className="bg-zinc-500 text-white p-2 rounded-md m-4 shadow-xl mb-6 focus:border-gray-600 focus:outline-none border-2 border-transparent"
          placeholder={
            canWriteMessage
              ? "Type your message..."
              : "You don't have the permission to write in this channel"
          }
          value={inputMessage}
          onChange={(event) => setInputMessage(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canWriteMessage) {
              handleSend(e);
            }
          }}
          autoComplete="off"
          disabled={!canWriteMessage}
        />
      </div>
      <SidebarUserOnDao daoId={currentDaoId} />

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
            <p className="mb-4">
              This is the content of the modal. You can place any text or
              components here.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Channel;
