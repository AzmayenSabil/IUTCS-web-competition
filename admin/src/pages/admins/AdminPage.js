import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import AdminListLayout from "../../components/adminList/AdminListLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

const AdminPage = () => {
  TabTitle("Portal - Admin List");
  return (
    <div style={{ display: "flex", backgroundColor: "white", height: "100vh" }}>
      <div style={{ flex: "0 0 20px" }}>
        <Sidebar selectedKey="9" />
      </div>
      <div
        style={{
          marginLeft: "20px",
          padding: "16px",
          overflowY: "auto",
          flex: "1",
        }}
      >
        <AdminListLayout />
      </div>
    </div>
  );
};

export default AdminPage;
