import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";

const SidebarUserOnDao = ({ roles, usersOffline }) => {


  if (!roles) {
    return null
  }

  return (
    <div className="bg-zinc-800 w-52 relative h-screen p-4 right-0 top-0">
      {Object.entries(roles).map(([roleName, roleData]) => (
        <div key={roleName}>
          <h2 className="text-white mb-2">
            {roleName} - {roleData.length}
          </h2>
          <div className="text-white">
            {roleData.map((user) => (
              <div
                key={user.id}
                className="flex items-center mb-2 px-2 py-1 w-11/12 bg-transparent hover:bg-white hover:bg-opacity-10 text-white hover:text-white rounded transition-colors duration-200 ease-in cursor-pointer"
              >
                <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                <span
                  style={{
                    color:
                      user.userRoles && user.userRoles[0]
                        ? user.userRoles[0].role.color
                        : "gray",
                  }}
                >
                  {user.pseudo}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-gray-400 mt-4">
        {usersOffline && usersOffline.map((user) => (
          <div
            key={user.id}
            className="flex items-center mb-2 px-2 py-1 w-11/12 bg-transparent hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white rounded transition-colors duration-200 ease-in cursor-pointer"
          >
            <span style={{ color: user.userRoles[0]?.role?.color || "gray" }}>
              {user.pseudo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarUserOnDao;
