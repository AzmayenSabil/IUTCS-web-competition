import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import ProfileLayout from "../../components/profile/ProfileLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

const ProfilePage = () => {
  TabTitle("Portal - Profile");
  return (
    <div>
      <div
        style={{ display: "flex", backgroundColor: "white", height: "100vh" }}
      >
        <div style={{ flex: "0 0 20px" }}>
          <Sidebar selectedKey="8" />
        </div>
        <ProfileLayout />
      </div>
    </div>
  );
};

export default ProfilePage;
