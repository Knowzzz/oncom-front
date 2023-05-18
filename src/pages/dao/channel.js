import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLastChannelId } from "../../features/userSlice";
import { Menu, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { io } from "socket.io-client";
import SidebarChannel from "./SidebarChannel";
import SidebarServers from "../../components/SidebarServers";
import SidebarUserOnDao from "./SidebarUserOnDao";
import { BsThreeDots } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import MessageInput from "../../components/MessageInput";
import SendMATICComponent from "../../components/SendMATICComponent";

const baseURL = "http://localhost:8080";

const Channel = () => {
  const { daoId, channelId } = useParams();
  const [currentDaoId, setCurrentDaoId] = useState(null);
  const [daoData, setDaoData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [messages, setMessages] = useState([]);
  const [canWriteMessage, setCanWriteMessage] = useState(true);
  const [userAvatars, setUserAvatars] = useState({});
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [usersOffline, setUsersOffline] = useState([]);
  const [roles, setRoles] = useState({});

  const [users, setUsers] = useState({});

  const fetchDao = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const result = await axios.get(`${baseURL}/api/dao/getOne`, {
        params: {
          daoId: daoId,
          userId: userId,
        },
        headers: {
          "x-access-token": accessToken,
        },
      });
      setDaoData(result.data.dao);
      setIsOwner(result.data.dao.ownerId === userId);
    } catch (error) {
      console.error("Error fetching DAO data:", error);
    }
  };

  useEffect(() => {
    if (!daoId) {
      return;
    }

    fetchDao();
  }, [daoId]);

  useEffect(() => {
    if (!daoId) {
      return;
    }
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/api/dao/getUsers`, {
          params: {
            userId: JSON.parse(localStorage.getItem("user")).id,
            daoId: daoId,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });

        if (response.status === 200) {
          const {
            usersOnlineGroupedByRole: online,
            usersOffline: offline,
            users,
          } = response.data;
          setUsersOffline(offline);
          setUsers(users);
          setRoles(online);
        } else {
          console.error(
            "Error fetching users:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [daoId]);

  const socket = io(`${baseURL}/channel-message`, {
    query: { userId, channelId, daoId },
  });

  const deleteMessage = (messageId) => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    socket.emit("delete-message", { messageId, userId, daoId });
  };

  useEffect(() => {
    if (!daoId || !channelId) {
      return;
    }
    socket.on("initial-messages", ({ messages, canWriteMessage }) => {
      setMessages(messages);
      setCanWriteMessage(canWriteMessage);
    });

    socket.on("new-message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("delete-message", (messageId) => {
      setMessages((messages) =>
        messages.filter((message) => message.id !== messageId)
      );
    });

    setCurrentDaoId(daoId);

    return () => {
      if (socket) {
        socket.off("initial-messages");
        socket.off("new-message");
        socket.off("delete-message");
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
      <SidebarChannel
        daoId={currentDaoId}
        channelId={channelId}
        users={users}
        setUsers={setUsers}
        daoData={daoData}
        setDaoData={setDaoData}
        isOwner={isOwner}
        setIsOwner={setIsOwner}
      />
      <div className="flex-1 flex flex-col bg-zinc-700">
        <div className="flex-1 bg-zinc-700 px-4 py-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                index > 0 && messages[index - 1].user.id === message.user.id
                  ? ""
                  : "mb-1"
              }`}
              onMouseEnter={() => setHoveredMessage(index)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div
                className={`${
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
                  {message.content.startsWith("/MATIC-SHIPMENTS-REQUEST") ? (
                    <SendMATICComponent
                      recipientPseudo={message.user.pseudo}
                      recipientAddress={message.user.wallet_address}
                      daoId={currentDaoId}
                    />
                  ) : (
                    message.content
                  )}
                  <Menu as="div" className="absolute top-1 right-2">
                    {hoveredMessage === index && (
                      <Menu.Button className="text-xl hover:border hover:border-gray-500 hover:bg-zinc-600 hover:shadow-xl rounded-full">
                        <BsThreeDots />
                      </Menu.Button>
                    )}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 w-56 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      >
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? "bg-violet-500 text-white"
                                    : "text-gray-900"
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                onClick={() => {
                                  setShowModal(true);
                                }}
                              >
                                Update
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? "bg-red-500 text-white"
                                    : "text-red-500"
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                onClick={() => deleteMessage(message.id)}
                              >
                                <TrashIcon
                                  className={`mr-2 h-5 w-5 ${
                                    active ? "text-white" : "text-red-500"
                                  }`}
                                />
                                Supprimer
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MessageInput
          canWriteMessage={canWriteMessage}
          socket={socket}
          daoId={currentDaoId}
          channelId={channelId}
        />
      </div>
      <SidebarUserOnDao roles={roles} usersOffline={usersOffline} />

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
