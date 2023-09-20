import React from "react";
import RegisterFormLayout from "../../components/authentication/registration/RegisterFormLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function RegisterFormPage() {
  TabTitle("Portal - Register");
  return <RegisterFormLayout />;
}
