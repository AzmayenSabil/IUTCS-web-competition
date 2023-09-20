import React from "react";
import ActiveEmployeeLayout from "./employee/ActiveEmployeeLayout";
import ExpiredEmployeeLayout from "./employee/ExpiredEmployeeLayout";
import CheckAuth from "../authentication/common/hooks/CheckAuth";
import EmployeeInformationTabLayout from "./employee/EmployeeInformationTabLayout";
import { Badge, FloatButton } from "antd";

export default function EmployeeInformationLayout() {
  CheckAuth();

  return (
    <>
      <div className="content_wrapper" style={{ padding: "70px" }}>
        <EmployeeInformationTabLayout />

        <FloatButton.BackTop tooltip="Move Up" />
      </div>
    </>
  );
}
