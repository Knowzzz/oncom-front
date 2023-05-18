// MainLayout.js
import React from "react";
import SidebarServers from "../../components/SidebarServers";
import SidebarFriend from "../../components/SidebarFriend";
import UserProfile from "../../components/UserProfile";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-zinc-700 h-screen w-screen">
      <div className="flex h-full">
        <SidebarServers />
        <SidebarFriend />
        <div className="bg-zinc flex flex-col p-6 flex-grow">
          <Outlet />
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default MainLayout;
