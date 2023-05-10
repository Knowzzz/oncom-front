import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarFriend from "../../components/SidebarFriend";
import SidebarServers from "../../components/SidebarServers";
import FriendProfile from "./FriendProfile";
import { BsThreeDots } from "react-icons/bs";
import Modal from "react-modal";
import { io } from "socket.io-client";
import axios from "axios";

const baseURL = "http://localhost:8080";

const FriendMessage = () => {
  const { friendId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const socket = io(`${baseURL}/friend-message`, {
    query: { userId, friendId },
  });

  function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank">${url}</a>`
    );
  }

  const [currentFriendId, setCurrentFriendId] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userAvatars, setUserAvatars] = useState({});
  const [messages, setMessages] = useState([
    // Example messages
    {
      messageId: 1,
      messageContent: "Salut !",
      writer: {
        pseudo: "Alice",
        wallet_address: "0x123",
        id: 1,
      },
      messageDate: "2023-04-10",
    },
    {
      messageId: 2,
      messageContent: "Salut, comment ça va ?",
      writer: {
        pseudo: "bob",
        wallet_address: "0x321",
        id: 13,
      },
      messageDate: "2023-04-10",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    messages.forEach(async (message) => {
      if (!userAvatars[message.writer.id]) {
        await getAvatarUrl(message.writer);
      }
    });
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

  return (
    <div className="h-screen w-screen bg-zinc-700 text-white flex">
      <SidebarServers />
      <SidebarFriend friendId={friendId} />
      <div className="flex-1 flex flex-col bg-zinc-700">
        <div className="flex-1 bg-zinc-700 px-4 py-2">
          {messages.map((message, index) => (
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
          ))}
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
