import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import PastMenuListLayout from "../../components/pastMenuList/PastMenuListLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function MenusPage() {
  TabTitle("Portal - Past Menu List");
  return (
    <>
      <div
        style={{ display: "flex", backgroundColor: "white", height: "100vh" }}
      >
        <div style={{ flex: "0 0 20px" }}>
          <Sidebar selectedKey="5" />
        </div>
        <div
          style={{
            marginLeft: "20px",
            padding: "16px",
            overflowY: "auto",
            flex: "1",
          }}
        >
          <PastMenuListLayout />
        </div>
      </div>
    </>
  );
}
