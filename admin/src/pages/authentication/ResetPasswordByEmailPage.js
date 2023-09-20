import React from "react";
import ResetPasswordLayoutByEmailLayout from "../../components/authentication/passwordRecovery/ResetPasswordLayoutByEmailLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function ResetPasswordByEmailPage() {
  TabTitle("Portal - Password Recovery");
  return <ResetPasswordLayoutByEmailLayout />;
}
