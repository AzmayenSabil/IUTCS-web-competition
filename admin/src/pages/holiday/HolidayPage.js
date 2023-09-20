import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import TabTitle from "../../utils/tabTitle/TabTitle";
import HolidayListLayout from "../../components/holidayList/HolidayListLayout";

export default function MenusPage() {
  TabTitle("Portal - Holiday List");
  return (
    <>
      <div
        style={{ display: "flex", backgroundColor: "white", height: "100vh" }}
      >
        <div style={{ flex: "0 0 20px" }}>
          <Sidebar selectedKey="10" />
        </div>
        <div
          style={{
            marginLeft: "20px",
            padding: "16px",
            overflowY: "auto",
            flex: "1",
          }}
        >
            <HolidayListLayout />
        </div>
      </div>
    </>
  );
}
