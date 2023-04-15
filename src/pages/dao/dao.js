import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import SidebarChannel from "../../components/SidebarChannel";
import SidebarServers from "../../components/SidebarServers";
import SidebarUserOnDao from "../../components/SidebarUserOnDao";

const baseURL = "http://localhost:8080"

const Dao = () => {
  const { daoId } = useParams();
  const [currentDaoId, setCurrentDaoId] = useState(null);
  const [daoData, setDaoData] = useState(null);

  useEffect(() => {
    setCurrentDaoId(daoId);
  }, [daoId]);
  

  return (
    <div className="flex">
        <SidebarServers />
        <SidebarChannel daoId={currentDaoId}/>
        <SidebarUserOnDao daoId={currentDaoId} />
    </div>
  );

}

export default Dao;