import React from "react";
import ResetPasswordFromProfileLayout from "../../components/authentication/passwordRecovery/ResetPasswordFromProfileLayout";
import ClientNavbarLayout from "../../components/navbar/ClientNavbarLayout";
import TabTitle from "../../utils/TabTitle";

export default function ResetPasswordFromProfilePage() {
  TabTitle("Portal - Reset Password");
  return (
    <>
      <ClientNavbarLayout />
      <ResetPasswordFromProfileLayout />
    </>
  );
}
