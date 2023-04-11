import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  if (!result.data.success) return false;
  return result.data.success;
};

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  const [isAuthenticatedStatus, setIsAuthenticatedStatus] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await isAuthenticated();
        setIsAuthenticatedStatus(result);
      } catch (error) {
        console.error('Error during authentication check:', error);
        setIsAuthenticatedStatus(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticatedStatus === false) {
      navigate("/");
    }
  }, [isAuthenticatedStatus, navigate]);

  return isAuthenticatedStatus
    ? React.cloneElement(children)
    : null;
};

export default AuthWrapper;
