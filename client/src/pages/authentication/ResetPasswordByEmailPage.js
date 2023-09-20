import React from "react";
import ResetPasswordLayout from "../../components/authentication/passwordRecovery/ResetPasswordLayoutByEmailLayout";
import ResetPasswordLayoutByEmailLayout from "../../components/authentication/passwordRecovery/ResetPasswordLayoutByEmailLayout";
import TabTitle from "../../utils/TabTitle";

export default function ResetPasswordByEmailPage() {
  TabTitle("Portal - Password Recovery");
  return <ResetPasswordLayoutByEmailLayout />;
}
