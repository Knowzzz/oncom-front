import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL, FRONT_SITE_URL } from "./const";
import axios from "axios";

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
  return result.data.success;
};

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedStatus, setIsAuthenticatedStatus] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await isAuthenticated();
        setIsAuthenticatedStatus(result);
        if (!result) {
          navigate("/signup");
        }
        setLoading(false);
      } catch (error) {
        console.error('Error during authentication check:', error);
        setIsAuthenticatedStatus(false);
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return isAuthenticatedStatus ? React.cloneElement(children) : null;
  }
};

export default AuthWrapper;
