import { useState, useEffect } from "react";
import axios from "axios";

const baseURL = "http://localhost:8080";

const SidebarUserOnDao = ({ daoId }) => {
  const [usersOnline, setUsersOnline] = useState([]);
  const [usersOffline, setUsersOffline] = useState([]);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    if (!daoId) {
      return;
    }
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/api/dao/getUsers`, {
          params: {
            userId: JSON.parse(localStorage.getItem("user")).id,
            daoId: daoId,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });

        if (response.status === 200) {
          const [online, offline] = response.data;
          setUsersOnline(online);
          setUsersOffline(offline);

          const rolesMap = online.reduce((acc, user) => {
            const roleId = user.userRoles[0]?.role?.id || -1;
            const roleName = user.userRoles[0]?.role?.name || "Other";

            if (!acc[roleId]) {
              acc[roleId] = {
                name: roleName,
                users: [],
              };
            }

            acc[roleId].users.push(user);
            return acc;
          }, {});

          setRoles(rolesMap);
        } else {
          console.error(
            "Error fetching users:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [daoId]);

  return (
    <div className="bg-gray-800 w-52 relative h-screen p-4 right-0 top-0">
      {Object.entries(roles).map(([roleId, roleData]) => (
        <div key={roleId}>
          <h2 className="text-white mb-2">
            {roleData.name} - {roleData.users.length}
          </h2>
          <div className="text-white">
            {roleData.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center mb-2 px-2 py-1 w-11/12 bg-transparent hover:bg-white hover:bg-opacity-10 text-white hover:text-white rounded transition-colors duration-200 ease-in cursor-pointer"
              >
                <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                <span
                  style={{
                    color: user.userRoles[0]?.role?.color || "gray",
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
        {usersOffline.map((user) => (
          <div
            key={user.id}
            className="flex items-center mb-2 px-2 py-1 w-11/12 bg-transparent hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white rounded transition-colors duration-200 ease-in cursor-pointer"
          >
            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-gray-500"></span>
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
