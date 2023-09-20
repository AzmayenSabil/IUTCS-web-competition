import React, { useEffect } from "react";
import ClientNavbarLayout from "../../components/navbar/ClientNavbarLayout";
import ClientProfileLayout from "../../components/profile/ClientProfileLayout";
import { useLocation } from "react-router-dom";
import TabTitle from "../../utils/TabTitle";
import ClientProfileCompletionLayout from "../../components/profile/ClientProfileCompletionLayout";

export default function ClientProfileCompletionPage() {
  // const location = useLocation();

  // useEffect(() => {

  //   const { pathname } = location;
  //   let title = "";
  //   if (pathname === "/client-profile") {
  //     title = "Meal Time | Profile";
  //   }
  //   document.title = title;
  // }, [location]);
  TabTitle("Portal - Profile");
  return (
    <>
      <ClientNavbarLayout />
      <ClientProfileCompletionLayout />
    </>
  );
}
