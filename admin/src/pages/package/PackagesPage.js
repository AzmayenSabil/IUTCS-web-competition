import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import PackageListLayout from "../../components/packageList/PackageListLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function PackagesPage() {
  TabTitle("Portal - Package List");
  return (
    <>
      <div
        style={{ display: "flex", backgroundColor: "white", height: "100vh" }}
      >
        <div style={{ flex: "0 0 20px" }}>
          <Sidebar selectedKey="3" />
        </div>
        <div
          style={{
            marginLeft: "20px",
            padding: "16px",
            overflowY: "auto",
            flex: "1",
          }}
        >
          <PackageListLayout />
        </div>
      </div>
    </>
  );
}
