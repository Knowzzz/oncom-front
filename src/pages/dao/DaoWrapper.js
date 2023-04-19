import { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLastChannelId } from "../../features/userSlice";
import axios from "axios";

const baseURL = "http://localhost:8080";

const DaoWrapper = () => {
  const { daoId } = useParams();
  const lastChannelId = useSelector((state) => state.user.lastChannelId[daoId]); // Récupère le lastChannelId pour la DAO actuelle
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDaoData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userId = JSON.parse(localStorage.getItem("user")).id;

      const response = await axios.get(`${baseURL}/api/dao/getOne`, {
        params: {
          daoId: daoId,
          userId: userId,
        },
        headers: {
          "x-access-token": accessToken,
        },
      });

      if (lastChannelId) {
        navigate(`/dao/${daoId}/${lastChannelId}`);
      } else {
        const firstChannelId = response.data.dao.channels[0].id;
        navigate(`/dao/${daoId}/${firstChannelId}`);
        dispatch(setLastChannelId({ daoId: daoId, channelId: firstChannelId }));
      }
    };

    fetchDaoData();
  }, [daoId, lastChannelId, dispatch, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DaoWrapper;
