import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SidebarFriend from "../../components/SidebarFriend";
import SidebarServers from "../../components/SidebarServers";
import FriendProfile from "./FriendProfile";
import axios from "axios";
import { io } from "socket.io-client";

const baseURL = "http://localhost:8080";
const socket = io("http://localhost:8080");

const FriendMessage = () => {
  const { friendId } = useParams();
  const [currentFriendId, setCurrentFriendId] = useState(null);
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
    setCurrentFriendId(friendId);
    // Fetch messages for the friend
    const fetchMessages = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${baseURL}/api/message/friend/get`,
          {
            userId: JSON.parse(localStorage.getItem("user")).id,
            friendId: friendId,
          },
          {
            headers: {
              "x-access-token": accessToken,
            },
          }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();

    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("new-message");
    };
  }, [friendId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputMessage.trim() === "") return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = JSON.parse(localStorage.getItem("user")).id;
      await axios.post(
        `${baseURL}/api/message/friend/create`,
        {
          userId,
          friendId,
          content: inputMessage,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      setInputMessage("");

      socket.emit("new-message", {
        messageId: Date.now(),
        messageContent: inputMessage,
        writer: {
          pseudo: "Your name or username here",
          wallet_address: "Your wallet address here",
          id: userId,
        },
        messageDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-800 flex">
      <SidebarServers />
      <SidebarFriend />
      <div       className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-700 px-4 py-2 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.messageId}
              className={`${
                message.writer.id === currentFriendId ? "ml-auto" : "mr-auto"
              } flex flex-col mb-2 max-w-full rounded-md`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-s text-white">{message.writer.pseudo}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              <p
                className={`text-sm text-white p-2 rounded-md ${
                  message.writer.id === currentFriendId
                    ? "bg-gray-600"
                    : "bg-gray-500"
                }`}
              >
                {message.messageContent}
              </p>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center px-4 py-2 bg-gray-600"
        >
          <input
            type="text"
            className="bg-gray-500 text-white w-full p-2 rounded-md"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                handleSubmit(event);
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white ml-2 py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
      <FriendProfile friendId={currentFriendId} />
    </div>
  );
};

export default FriendMessage;

