import React from "react";
import ResetPasswordFromProfileLayout from "../../components/authentication/passwordRecovery/ResetPasswordFromProfileLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function ResetPasswordFromProfilePage({ loggedInUserName }) {
  TabTitle("Portal - Password Recovery");
  return (
    <>
      <ResetPasswordFromProfileLayout />
    </>
  );
}
