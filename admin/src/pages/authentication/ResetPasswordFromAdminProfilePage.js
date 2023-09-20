import React from "react";
import TabTitle from "../../utils/tabTitle/TabTitle";
import ResetPasswordLayoutFromAdminProfile from "../../components/authentication/passwordRecovery/ResetPasswordLayoutFromAdminProfile";

export default function ResetPasswordFromAdminProfilePage({
  loggedInUserName,
}) {
  TabTitle("Portal - Password Recovery");
  return (
    <>
      <ResetPasswordLayoutFromAdminProfile />
    </>
  );
}
