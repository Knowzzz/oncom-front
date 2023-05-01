import React from "react";
import { RxCross2 } from "react-icons/rx";
import OverviewButton from "./Buttons/Overview";

export const Overview = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
  daoData,
}) => {
  return (
    <OverviewButton
      daoSettingsModalOpen={daoSettingsModalOpen}
      setDaoSettingsModalOpen={setDaoSettingsModalOpen}
      daoData={daoData}
    />
  );
};

export const Roles = ({ daoSettingsModalOpen, setDaoSettingsModalOpen }) => {
  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Roles</h2>
              <button
                className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
                onClick={() => setDaoSettingsModalOpen(false)}
              >
                <RxCross2 className="w-8 h-8" />
              </button>
            </div>
            <div className="modal-body">{/* Modal content goes here */}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Members = ({ daoSettingsModalOpen, setDaoSettingsModalOpen }) => {
  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Members</h2>
              <button
                className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
                onClick={() => setDaoSettingsModalOpen(false)}
              >
                <RxCross2 className="w-8 h-8" />
              </button>
            </div>
            <div className="modal-body">{/* Modal content goes here */}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Invitations = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
}) => {
  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Invitations</h2>
              <button
                className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
                onClick={() => setDaoSettingsModalOpen(false)}
              >
                <RxCross2 className="w-8 h-8" />
              </button>
            </div>
            <div className="modal-body">{/* Modal content goes here */}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Ban = ({ daoSettingsModalOpen, setDaoSettingsModalOpen }) => {
  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Ban</h2>
              <button
                className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
                onClick={() => setDaoSettingsModalOpen(false)}
              >
                <RxCross2 className="w-8 h-8" />
              </button>
            </div>
            <div className="modal-body">{/* Modal content goes here */}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SecurityAlert = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
}) => {
  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>SecurityAlert</h2>
              <button
                className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
                onClick={() => setDaoSettingsModalOpen(false)}
              >
                <RxCross2 className="w-8 h-8" />
              </button>
            </div>
            <div className="modal-body">{/* Modal content goes here */}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Web3Management = ({
  daoSettingsModalOpen,
  setDaoSettingsModalOpen,
}) => {
  return (
    <div>
      {daoSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Web3Management</h2>
              <button
                className="close-btn border border-gray-400 rounded-full text-gray-400 hover:border-white hover:text-white absolute right-0 top-0 m-4"
                onClick={() => setDaoSettingsModalOpen(false)}
              >
                <RxCross2 className="w-8 h-8" />
              </button>
            </div>
            <div className="modal-body">{/* Modal content goes here */}</div>
          </div>
        </div>
      )}
    </div>
  );
};
