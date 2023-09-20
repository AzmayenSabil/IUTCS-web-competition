import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateOutlet() {
  const storedClientInfo = sessionStorage.getItem("clientInfo");
  const { auth } = storedClientInfo ? JSON.parse(storedClientInfo) : {};

  if (auth !== true) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
