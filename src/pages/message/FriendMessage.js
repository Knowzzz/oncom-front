import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarFriend from "../../components/SidebarFriend";
import SidebarServers from "../../components/SidebarServers";
import FriendProfile from "./FriendProfile";
import { io } from "socket.io-client";

const baseURL = "http://localhost:8080";

const FriendMessage = () => {
  const { friendId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const socket = io(`${baseURL}/friend-message`, {
    query: { userId, friendId },
  });

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
    socket.on("initial-messages", (data) => {
      const { messages, user1, user2 } = data;
      
      const formattedMessages = messages.map((message) => ({
        messageId: message.id,
        messageContent: message.content,
        writer: {
          pseudo: message.userId === user1.id ? user1.pseudo : user2.pseudo,
          wallet_address: message.userId === user1.id ? user1.wallet_address : user2.wallet_address,
          id: message.userId,
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
        },
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    return () => {
      socket.off("initial-messages");
      socket.off("new-message");
    };
  }, [friendId]);

  const handleSubmit = async (event) => {
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
    <div className="h-screen w-screen bg-gray-800 flex">
      <SidebarServers />
      <SidebarFriend friendId={friendId}  />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-700 px-4 py-2 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.messageId}
              className={`${
                message.writer && message.writer.id === currentFriendId
                  ? "ml-auto"
                  : "mr-auto"
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
        </form>
      </div>
      <FriendProfile key={friendId} friendId={friendId}/>
    </div>
  );
};

export default FriendMessage;
