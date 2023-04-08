import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const baseURL = "http://localhost:8080";

const isAuthenticated = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !accessToken) { return false }
  const result = await axios.get(`${baseURL}/api/user/validToken`, {
    params: {
      userId: user.id,
    },
    headers: {
      "x-access-token": accessToken,
    },
  });

  return result.data;
};

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  const state = useSelector((state) => state);
  const [isAuthenticatedStatus, setIsAuthenticatedStatus] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await isAuthenticated();
      setIsAuthenticatedStatus(result);
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticatedStatus === false) {
      navigate("/");
    }
  }, [isAuthenticatedStatus, navigate]);

  return isAuthenticatedStatus
    ? React.cloneElement(children, { walletAddress: state.user.address })
    : null;
};

export default AuthWrapper;
