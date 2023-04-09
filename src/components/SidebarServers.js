import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";

const baseURL = "http://localhost:8080";

const SidebarServers = () => {
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServers = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const result = await axios.get(`${baseURL}/api/dao/getAllForUser`, {
          params: {
            userId: user.id,
          },
          headers: {
            "x-access-token": accessToken,
          },
        });
        setServers(result.data);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    fetchServers();
  }, []);

  return (
    <div className="bg-gray-900 w-16 flex flex-col items-center py-4">
      {servers.map((server) => (
        <img
          key={server.id}
          src={server.logo}
          alt={server.name}
          className="rounded-full w-12 h-12 mb-4"
        />
      ))}
      <button
        className="bg-green-500 hover:bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
        onClick={() => navigate("/create-dao")}
      >
        <AiOutlinePlusCircle className="text-gray-800 hover:text-green-500 text-2xl" />
      </button>
    </div>
  );
};

export default SidebarServers;
