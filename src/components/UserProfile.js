import { RiLogoutBoxLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:8080";

const UserProfile = () => {
  const [user, setUser] = useState({
    wallet_address: "",
    pseudo: "",
    avatar: "",
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/home");
  };

  const updateUser = async (userId, pseudo, wallet_address, avatar) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("pseudo", pseudo);
      formData.append("wallet_address", wallet_address);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.post(
        `${baseURL}/api/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": accessToken,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        window.location.reload();
      } else {
        console.log("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await updateUser(user.id, user.pseudo, user.wallet_address, newAvatar);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {

  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`${baseURL}/api/user/get`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setUser(response.data.user);
        setAvatarUrl(`${baseURL}/static${response.data.user.avatar}`);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        console.log(error);
        return error;
      }
      if (newAvatar) {
        setAvatarUrl(URL.createObjectURL(newAvatar));
      }
    };
    fetchUser();
  }, [newAvatar]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-700 border border-gray-500 w-1/4 flex flex-col p-4">
      <div className="flex justify-center">
        <label htmlFor="avatar">
          <img
            src={avatarUrl || "/image.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full cursor-pointer border-2 border-gray-600"
          />
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={(event) => {
            console.log("File input onChange triggered");
            setNewAvatar(event.target.files[0]);
            const newAvatarUrl = URL.createObjectURL(event.target.files[0]);
            console.log("New avatar URL:", newAvatarUrl);
            setAvatarUrl(newAvatarUrl);
          }}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="username" className="text-white font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.pseudo || ""}
            onChange={handleChange}
            className="bg-gray-600 text-white w-full p-2 rounded-md mt-2"
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
            value={user.wallet_address}
            onChange={handleChange}
            className="bg-gray-600 text-white w-full p-2 rounded-md mt-2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2 rounded-md mt-4 hover:bg-green-600"
        >
          Valider
        </button>
        <button
          type="button"
          className="bg-red-500 text-white w-full p-2 rounded-md mt-4 hover:bg-red-600"
          onClick={() => setIsDeleteAccountModalOpen(true)}
        >
          Supprimer le compte
        </button>
      </form>
      <div className="fixed bottom-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center bg-red-500 text-white px-3 py-2 rounded-full"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <RiLogoutBoxLine className="mr-1" />
          <span>Déconnexion</span>
        </motion.button>
      </div>

      <Transition show={isLogoutModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsLogoutModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Se déconnecter
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => setIsLogoutModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={() => {
                    handleLogout();
                    setIsLogoutModalOpen(false);
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition show={isDeleteAccountModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsDeleteAccountModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Supprimer le compte
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Signez cette transaction pour valider la suppression de votre compte.
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={handleDeleteAccount}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserProfile;
