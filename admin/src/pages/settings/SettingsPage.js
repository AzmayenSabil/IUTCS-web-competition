import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import SettingsPageLayout from "../../components/settings/SettingsPageLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function PackagesPage() {
  TabTitle("Portal - Settings");
  return (
    <>
      <div
        style={{ display: "flex", backgroundColor: "white", height: "100vh" }}
      >
        <div style={{ flex: "0 0 20px" }}>
          <Sidebar selectedKey="6" />
        </div>
        <div
          style={{
            marginLeft: "20px",
            padding: "16px",
            overflowY: "auto",
            flex: "1",
          }}
        >
          <SettingsPageLayout />
        </div>
      </div>
    </>
  );
}
