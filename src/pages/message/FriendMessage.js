import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarFriend from "../../components/SidebarFriend";
import SidebarServers from "../../components/SidebarServers";
import FriendProfile from "./FriendProfile";
import { BsThreeDots } from "react-icons/bs";
import Modal from "react-modal";
import { io } from "socket.io-client";
import axios from "axios";
import { setLoading } from "../../features/userSlice";
import LoadingPage from "../../components/Loading";
import { useSelector, useDispatch } from "react-redux";

const baseURL = "http://localhost:8080";

const FriendMessage = () => {
  const { friendId } = useParams();

  const userId = JSON.parse(localStorage.getItem("user")).id;
  const socket = io(`${baseURL}/friend-message`, {
    query: { userId, friendId },
  });


  const [currentFriendId, setCurrentFriendId] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userAvatars, setUserAvatars] = useState({});
  const [messages, setMessages] = useState();
  const [inputMessage, setInputMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(!messages);

  useEffect(() => {
    if (!messages) {
      return;
    }
    messages.forEach(async (message) => {
      if (!userAvatars[message.writer.id]) {
        await getAvatarUrl(message.writer);
      }
    });
  }, [messages]);

  useEffect(() => { 
    if (messages) {
      setMessagesLoading(false);
    } else {
      setMessagesLoading(true);
    }
  }, [messages]);

  useEffect(() => {
    setCurrentFriendId(friendId);
    // Fetch messages for the friend
    socket.on("initial-messages", (data) => {
      const { messages, user1, user2 } = data;

      const formattedMessages = messages.map((message) => ({
        messageId: message.id,
        messageContent: message.content,
        writer: {
          pseudo: message.userId === user1.id ? user1.pseudo : user2.pseudo,
          wallet_address:
            message.userId === user1.id
              ? user1.wallet_address
              : user2.wallet_address,
          id: message.userId,
          avatar: message.userId === user1.id ? user1.avatar : user2.avatar,
        },
      }));
      setMessages(formattedMessages);
      setMessagesLoading(false);
    });

    socket.on("new-message", (message) => {
      const formattedMessage = {
        messageId: message.id,
        messageContent: message.content,
        writer: {
          pseudo: message.user.pseudo,
          wallet_address: message.user.wallet_address,
          id: message.userId,
          avatar: message.user.avatar,
        },
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    return () => {
      socket.off("initial-messages");
      socket.off("new-message");
    };
  }, [friendId]);

  const getAvatarUrl = async (writer) => {
    const userId = writer.id;
    const avatarPath = writer.avatar;

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

  const handleSend = async (event) => {
    event.preventDefault();
    if (inputMessage.trim() === "") return;

    try {
      if (socket) {
        socket.emit("new-message", {
          userId: userId,
          friendId: friendId,
          content: inputMessage,
        });

        setInputMessage("");
      }
    } catch (error) {
      return error;
    }
  };

  const LoadingSkeleton = () => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 mt-4 animate-pulse"
        >
          <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-5 bg-zinc-800 rounded w-1/12"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
          </div>
        </div>
      ));
  };

  console.log(messages)

  return (
    <div className="h-screen w-screen bg-zinc-700 text-white flex">
      <SidebarServers />
      <SidebarFriend friendId={friendId} />
      <div className="flex-1 flex flex-col bg-zinc-700">
        <div className="flex-1 bg-zinc-700 px-4 py-2">
          {messagesLoading ? (
            <LoadingSkeleton />
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredMessage(index)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div
                  className={`${
                    hoveredMessage === index ? "bg-zinc-600" : "bg-zinc-700"
                  } px-1 flex flex-col`}
                >
                  {index === 0 ||
                  (messages[index - 1] &&
                    messages[index - 1].writer.id !== message.writer.id) ? (
                    <div className="flex items-center">
                      <img
                        src={userAvatars[message.writer.id] || ""}
                        alt={`${message.writer.pseudo}'s avatar`}
                        className="w-10 h-10 rounded-full mr-4 mt-4"
                      />
                      {message.writer.pseudo}
                    </div>
                  ) : null}
                  <div
                    className={`${
                      hoveredMessage === index ? "bg-zinc-600" : "bg-zinc-700"
                    } px-10 w-full relative text-gray-300 pl-14`}
                  >
                    {message.messageContent}
                    {hoveredMessage === index && (
                      <BsThreeDots
                        className="absolute top-1 right-2 text-xl hover:border hover:border-gray-500 hover:bg-zinc-600 hover:shadow-xl rounded-full"
                        onClick={() => setShowModal(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <input
          type="text"
          className="bg-zinc-600 text-white p-2 rounded-md m-4 shadow-xl mb-6 focus:border-gray-600 focus:outline-none border-2 border-transparent"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(event) => setInputMessage(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(e);
            }
          }}
          autoComplete="off"
        />
      </div>
      <FriendProfile key={friendId} friendId={friendId} />
    </div>
  );
};

export default FriendMessage;
