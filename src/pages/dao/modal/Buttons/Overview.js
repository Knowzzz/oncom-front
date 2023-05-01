import React, { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";

const baseURL = "http://localhost:8080";

const OverviewButton = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData,
}) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [daoName, setDaoName] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const inputFileRef = useRef();

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    const newImageUrl = URL.createObjectURL(event.target.files[0]);
    setImageUrl(newImageUrl);
    setUnsavedChanges(true);
  };

  useEffect(() => {
    if (daoData) {
      setImageUrl(`${baseURL}/static/${daoData.avatar}`);
      setDaoName(daoData.name);
    }
  }, [daoData]);

  const triggerInputFileClick = () => {
    inputFileRef.current.click();
  };

  const handleDaoNameChange = (event) => {
    setDaoName(event.target.value);
    setUnsavedChanges(true);
  };

  const resetChanges = () => {
    setImageUrl(`${baseURL}/static/${daoData.avatar}`);
    setDaoName(daoData.name);
    setUnsavedChanges(false);
  };

  const saveChanges = () => {
    // Save changes logic here
    setUnsavedChanges(false);
  };

  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal relative">
          <h2 className="font-bold text-lg ml-10 mt-4">Overview Server</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="image" onClick={triggerInputFileClick}>
                <img
                  src={imageUrl || "/default-image.jpg"}
                  alt="DAO"
                  className="w-28 object-cover shadow-[-3px_10px_16px_9px_#00000024] m-10 rounded-full cursor-pointer border border-zinc-600"
                />
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleImageChange}
                ref={inputFileRef}
              />
              <div className="flex flex-col w-2/4 mx-4">
                <p className="text-sm leading-tight text-center">
                  Customize the profile picture for your DAO
                </p>
                <button
                  className="mt-2 px-4 py-2 text-sm border border-zinc-600 hover:bg-zinc-600"
                  onClick={triggerInputFileClick}
                >
                  Uploader une image
                </button>
              </div>
            </div>
            <div className="self-right">
              <label className="block font-bold mb-2 bg-zinc">
                Server Name
              </label>
              <input
                type="text"
                value={daoName}
                onChange={handleDaoNameChange}
                className="rounded-sm px-3 py-2 bg-zinc-800"
              />
            </div>
          </div>
          {unsavedChanges && (
            <div className="fixed bottom-0 left-1/4 w-1/2 p-4 bg-black rounded-lg animate-bounceY">
              <p className="text-gray-400 inline-block">
                Attention there are still unsaved modifications
              </p>
              <button
                className="bg-transparent text-gray-400 hover:text-white px-4 py-2 ml-4"
                onClick={resetChanges}
              >
                Réinitialiser
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-4"
                onClick={saveChanges}
              >
                Save changes
              </button>
            </div>
          )}
          <button
            className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
            onClick={() => setDaoSettingsModalOpen(false)}
          >
            <RxCross2 className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OverviewButton;
