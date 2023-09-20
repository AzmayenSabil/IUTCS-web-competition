import React from "react";
import CheckAuth from "../../authentication/common/hooks/CheckAuth";
import { Tabs } from "antd";
import ActiveEmployeeLayout from "./ActiveEmployeeLayout";
import ExpiredEmployeeLayout from "./ExpiredEmployeeLayout";
import activeEmployeeIcon from "../../../assets/activeEmployeeIcon.png";
import expiredEmployeeIcon from "../../../assets/expiredEmployeeIcon.png";

export default function EmployeeInformationTabLayout() {
  CheckAuth();

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: (
              <span>
                <i
                  class="fa fa-circle"
                  style={{ color: "#00FF00" }}
                  aria-hidden="true"
                ></i>
                &nbsp;&nbsp;Active Employees
              </span>
            ),
            key: "1",
            children: <ActiveEmployeeLayout />,
          },
        ]}
      />

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: (
              <span>
                <i
                  class="fa fa-circle"
                  style={{ color: "#EE4B2B" }}
                  aria-hidden="true"
                ></i>
                &nbsp;&nbsp;Expired Employees
              </span>
            ),
            key: "1",
            children: <ExpiredEmployeeLayout />,
          },
        ]}
      />
    </>
  );
}
