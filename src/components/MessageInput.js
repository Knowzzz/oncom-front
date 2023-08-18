import { Transition } from "@headlessui/react";
import {
  CashIcon,
  AnnotationIcon,
  ChatIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { TfiWallet } from "react-icons/tfi";
import Tooltip from "@mui/material/Tooltip";
import { toast, ToastContainer } from "react-toastify";

const MessageInput = ({
  canWriteMessage,
  socketMessages,
  daoId,
  channelId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
const [inputMessage, setInputMessage] = useState("");

  const userId = JSON.parse(localStorage.getItem("user")).id;

  const handleSendMaticRequest = () => {
    try {
      if (socketMessages) {
        socketMessages.emit("new-message", {
          userId: userId,
          channelId: channelId,
          content: "/MATIC-SHIPMENTS-REQUEST",
          daoId: daoId,
        });
      }
    } catch (err) {
        toast.error(err);
      return err;
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (inputMessage.trim() === "") return;

    try {
      if (socketMessages) {
        socketMessages.emit("new-message", {
          userId: userId,
          channelId: channelId,
          content: inputMessage,
          daoId: daoId,
        });
        setInputMessage("");
      }
    } catch (error) {
        toast.error(error);
      return error;
    }
  };

  return (
    <div className="relative m-6">
        <ToastContainer />
      <Transition
        show={isOpen}
        enter="transition-all duration-200 transform ease-out"
        enterFrom="opacity-0 scale-75"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-100 transform ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
      >
        <div className="absolute right-4 top-[-12rem] flex flex-col space-y-2 bg-zinc-500 p-2 rounded-lg shadow-xl">
          <Tooltip
            title="Requests to receive matic!"
            arrow
            placement="left"
            onClick={handleSendMaticRequest}
          >
            <button className="p-1 rounded-full transition-colors hover:bg-gray-700">
              <AnnotationIcon className="h-6 w-6 text-white" />
            </button>
          </Tooltip>
          <Tooltip
            title="This is a tooltip for button 2"
            arrow
            placement="left"
          >
            <button className="p-1 rounded-full transition-colors hover:bg-gray-700">
              <ChatIcon className="h-6 w-6 text-white" />
            </button>
          </Tooltip>
          <Tooltip
            title="This is a tooltip for button 3"
            arrow
            placement="left"
          >
            <button className="p-1 rounded-full transition-colors hover:bg-gray-700">
              <EmojiHappyIcon className="h-6 w-6 text-white" />
            </button>
          </Tooltip>
        </div>
      </Transition>

      <Tooltip
        title="Open to do transaction to community"
        arrow
        placement="top"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-4 top-[-3rem] bg-zinc-500 p-2 rounded-full shadow-xl transition-transform hover:scale-110"
        >
          <TfiWallet className="h-6 w-6 text-white" />
        </button>
      </Tooltip>

      <input
        type="text"
        className="bg-zinc-500 text-white p-2 rounded-md shadow-xl mb-6 focus:border-gray-600 focus:outline-none border-2 border-transparent w-full"
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
  );
};

export default MessageInput;
