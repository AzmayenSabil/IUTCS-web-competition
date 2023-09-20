import { Tabs } from "antd";
import React from "react";
import BreakfastTabLayout from "./BreakfastTabLayout";
import LunchTabLayout from "./LunchTabLayout";

export default function HomeTabLayout() {
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: (
            <span>
              <i className="fas fa-mug-hot"></i>
              &nbsp;Breakfast
            </span>
          ),
          key: "1",
          children: <BreakfastTabLayout />,
        },
        {
          label: (
            <span>
              <i className="fa fa-cutlery"></i>
              &nbsp;Lunch
            </span>
          ),
          key: "2",
          children: <LunchTabLayout />,
        },
      ]}
    />
  );
}
