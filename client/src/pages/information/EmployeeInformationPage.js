import React from "react";

import TabTitle from "../../utils/TabTitle";
import EmployeeInformationLayout from "../../components/Information/EmployeeInformationLayout";
import ClientNavbarLayout from "../../components/navbar/ClientNavbarLayout";

export default function EmployeeInformationPage() {
  TabTitle("Portal - Employee Information");
  return (
    <>
      <ClientNavbarLayout />
      <EmployeeInformationLayout />
    </>
  );
}
