import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedClientInfo = sessionStorage.getItem("clientInfo");
    const { auth } = storedClientInfo ? JSON.parse(storedClientInfo) : {};

    if (auth !== true) {
      navigate("/login");
    }
  }, []);
  return null;
}
