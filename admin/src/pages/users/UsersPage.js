import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import UserListLayout from "../../components/userList/UserListLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

const UserPage = () => {
  TabTitle("Portal - User List");
  return (
    <div style={{ display: "flex", backgroundColor: "white", height: "100vh" }}>
      <div style={{ flex: "0 0 20px" }}>
        <Sidebar selectedKey="2" />
      </div>
      <div
        style={{
          marginLeft: "20px",
          padding: "16px",
          overflowY: "auto",
          flex: "1",
        }}
      >
        <UserListLayout />
      </div>
    </div>
  );
};

export default UserPage;
