import React from "react";
import LoginFormLayout from "../../components/authentication/login/LoginFormLayout";
import TabTitle from "../../utils/TabTitle";

export default function LoginFormPage() {
  TabTitle("Portal - Login");
  return <LoginFormLayout />;
}
