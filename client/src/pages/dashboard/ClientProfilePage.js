import React, { useEffect } from "react";
import ClientNavbarLayout from "../../components/navbar/ClientNavbarLayout";
import ClientProfileLayout from "../../components/profile/ClientProfileLayout";
import { useLocation } from "react-router-dom";
import TabTitle from "../../utils/TabTitle";

export default function ClientProfilePage() {
  TabTitle("Portal - Profile");
  return (
    <>
      <ClientNavbarLayout />
      <ClientProfileLayout />
    </>
  );
}
