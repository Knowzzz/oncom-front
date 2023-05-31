import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";
import "../../components/style.css";

const SidebarUserOnDao = ({ roles, usersOffline }) => {
  const [loading, setLoading] = useState(!roles);

  useEffect(() => {
    if (roles) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [roles]);

  const LoadingSkeleton = () => {
    return Array(15)
      .fill()
      .map((_, index) => (
        <div
          key={index}
          className="flex items-center mb-4 px-2 py-1 w-11/12 bg-transparent bg-white bg-opacity-10 text-white text-white rounded transition-colors duration-200 ease-in cursor-pointer animate-pulse"
        >
          <span className="inline-block w-2 h-2 mr-2 rounded-full bg-zinc-800 animate-pulse"></span>
          <div
            style={{ color: "gray" }}
            className="bg-zinc-800 bg-opacity-50 rounded"
          >
            <div className="w-32 h-4 bg-zinc-800 rounded mb-2 animate-pulse"></div>
          </div>
        </div>
      ));
  };

  return (
    <div className="bg-zinc-800 w-52 relative h-screen p-4 right-0 top-0 overflow-y-auto custom-scrollbar">
      {loading ? (
        LoadingSkeleton()
      ) : (
        <div>
          {roles &&
            Object.entries(roles).map(([roleName, roleData]) => (
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
            {usersOffline &&
              usersOffline.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center mb-2 px-2 py-1 w-11/12 bg-transparent hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white rounded transition-colors duration-200 ease-in cursor-pointer"
                >
                  <span
                    style={{ color: user.userRoles[0]?.role?.color || "gray" }}
                  >
                    {user.pseudo}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarUserOnDao;
