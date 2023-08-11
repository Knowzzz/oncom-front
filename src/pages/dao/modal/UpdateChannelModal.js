import React, { useState, useEffect } from 'react';
import { FiHash, FiSpeaker, FiThumbsUp } from "react-icons/fi";
import { IoPersonCircleOutline} from "react-icons/io5";
import Modal from "react-modal";
import { Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import { customRadioStyle } from "../../../components/ChannelType";
import axios from "axios";
import { ChannelType } from '../../../components/ChannelType';
import { baseURL } from '../../../components/const';

const UpdateChannelModal = ({
  updateChannelModalOpen,
  setUpdateChannelModalOpen,
  selectedCategoryId,
  setSelectedCategoryId,
  daoData,
  channelId,
  fetchDao
}) => {
  let currentChannel;
  if (daoData && daoData.channels) {
    currentChannel = daoData.channels.find(channel => Number(channel.id) === Number(channelId));
  }

  let currentCategoryId;
  if (daoData && daoData.categories) {
    daoData.categories.forEach((category) => {
      if (category.channels.some((channel) => Number(channel.id) === Number(channelId))) {
        currentCategoryId = category.id;
      }
    });
  }

  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const [inputChannelName, setInputChannelName] = useState(currentChannel.name);
  const [channelType, setChannelType] = useState(currentChannel.type);
  const [isPrivate, setIsPrivate] = useState(currentChannel.isPrivate);
  const [rolesWithAccess, setRolesWithAccess] = useState([]);

  const handleUpdateChannel = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/channel/update`,
        {
          daoId: daoData.id,
          userId: user.id,
          channelName: inputChannelName,
          channelType: channelType,
          categorieId: selectedCategoryId,
          isPrivate: isPrivate
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Le canal a été créé avec succès !");
        setUpdateChannelModalOpen(false);
        fetchDao();
      } else {
        toast.error("Error while creating channel");
      }
    } catch (err) {
      toast.error("An error while occured.")
      return err;
    }
  }

  const handleRoleButtonClick = (role) => {
    alert(`Clicked role: ${role.name}`);
  };


  useEffect(() => {
    setInputChannelName(currentChannel.name);
    setChannelType(currentChannel.type);
    setIsPrivate(currentChannel.isPrivate);
    setSelectedCategoryId(currentCategoryId || '...');
  }, [channelId, currentChannel])

  const handleChannelTypeChange = (e) => {
    setChannelType(e.target.value);
  };

  const addRolesAlert = () => {
    alert("Adding Roles");
  };

  useEffect(() => {
    setRolesWithAccess([]);
    if (daoData && daoData.roles) {
      daoData.roles.forEach((role) => {
        if (role.rolePermissions && role.rolePermissions.isServerAdmin) {
          setRolesWithAccess(prev => [...prev, role]);
        }
        if (role.roleChannel && role.roleChannel.channelRolePermissions && role.roleChannel.channelRolePermissions.canAccess) {
          if (daoData.isPrivate) {
            setRolesWithAccess(prev => [...prev, role]);
          }
        }
      });
    }
  }, [daoData.roles]);

  

  return (
    <Modal
      isOpen={updateChannelModalOpen}
      onRequestClose={() => setUpdateChannelModalOpen(false)}
      contentLabel="Update Channel Modal"
      className="m-auto w-1/2 z-1000 p-6 bg-zinc-700 text-white border border-zinc-700 rounded-md overflow-y-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out opacity-100"
      closeTimeoutMS={500}
    >
      <style>{customRadioStyle}</style>
      <h2 className="mb-4">Update Channel</h2>
      <ChannelType handleChannelTypeChange={handleChannelTypeChange} channelType={channelType} />
      <div className="mb-4">
        <label className="block">Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full mt-2 px-4 py-2 border border-zinc-700 rounded text-zinc-300 bg-zinc-600"
        >
          <option value="...">...</option>
          {daoData.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block">Channel Name</label>
        <div className="flex mt-2 items-center">
          {channelType === "TEXT" ? (
            <FiHash className="text-gray-400" />
          ) : channelType === "VOCAL" ? (
            <FiSpeaker className="text-gray-400" />
          ) : (
            <FiThumbsUp className="text-gray-400" />
          )}
          <input
            type="text"
            placeholder="new-channel"
            value={inputChannelName}
            onChange={(e) => setInputChannelName(e.target.value)}
            className="w-full ml-2 px-4 py-2 border border-gray-700 rounded text-gray-300 bg-zinc-600"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block">Private Channel</label>
        <Switch
          checked={isPrivate}
          onChange={setIsPrivate}
          className={`${isPrivate ? 'bg-green-500' : 'bg-gray-500'} relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className="sr-only">Private</span>
          <span
            className={`${isPrivate ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
        {isPrivate && (
          <div className="mt-4">
            <div className="mb-2">
              <span className="font-bold mr-20">Who has access to this channel?</span>
              <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-20 mb-4"
              onClick={addRolesAlert}
            >
              Add Roles
            </button>
              <div className="border-b border-zinc-600 mb-4"></div>
              <div className="font-bold">Roles</div>
            </div>
            
            <div className="mt-2 grid grid-cols-3 gap-2">
              {rolesWithAccess.map((role) => (
                <div
                  key={role.id}
                  className="role-container bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded mb-2 w-full flex items-center relative border-b border-zinc-600"
                >
                  <IoPersonCircleOutline
                    className="mr-4"
                    style={{
                      color: role.color,
                      fontSize: "1.5rem",
                      verticalAlign: "middle",
                    }}
                  />
                  <span className="role-name align-middle flex-grow">
                    {role.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setUpdateChannelModalOpen(false)}
        >
          Back
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleUpdateChannel}
        >
          Update Channel
        </button>
      </div>
    </Modal>
  );
};

export default UpdateChannelModal;
