import { useEffect } from "react";
import axios from "axios";
import {
  OrderedListOutlined,
  ProfileOutlined,
  RightOutlined,
  UserOutlined,
  SettingOutlined,
  FormOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Layout, Menu, Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BorderColorSharpIcon from "@mui/icons-material/BorderColorSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const { Sider } = Layout;

function getItem(label, key, icon, onClick) {
  return {
    label,
    key,
    icon,
    onClick,
  };
}

const Sidebar = ({ selectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false); // State to control showing the "Admins" menu item
  const base_url = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    checkSuperAdmin();
    //console.log(showAdmins);
  }, [showAdmins]);

  const handleLogout = () => {
    // Remove the session item
    sessionStorage.removeItem("clientInfo");
    // setShowAdmins(false)

    navigate("/login");
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "8":
        navigate("/admin/profile");
        break;
      case "1":
        navigate("/admin/dashboard");
        break;
      case "2":
        navigate("/admin/users");
        break;
      case "3":
        navigate("/admin/packages");
        break;
      case "4":
        navigate("/admin/menus");
        break;
      case "5":
        navigate("/admin/pastmenus");
        break;
      case "6":
        navigate("/admin/settings");
        break;
      case "9":
        navigate("/admin/admins");
        break;
      case "10":
        navigate("/admin/holidays");
        break;
      case "7":
        navigate("/login");
      default:
        break;
    }
  };

  const checkSuperAdmin = async () => {
    try {
      const token = sessionStorage.getItem("token");

      // Get user_id from the session
      const userId = JSON.parse(sessionStorage.getItem("clientInfo")).user_id;

      if (!userId) {
        // No user_id, not a super admin
        return false;
      }

      // Fetch admin data from the database
      const response = await axios.get(
        `${base_url}/api/v1/admin/admins/getAdmin/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const adminData = response.data.data; // Assuming the response contains admin info
      // console.log(adminData.isSuperAdmin)

      if (adminData.isSuperAdmin === "yes") {
        // console.log("yes")
        setShowAdmins(true);
        return true;
      } else {
        // console.log("no")
        setShowAdmins(false);
        return false;
      }
    } catch (error) {
      // Handle errors
      console.error("Error checking super admin status:", error);
      return false;
    }
  };

  const items = [
    getItem("Dashboard", "1", <ProfileOutlined />, handleMenuClick),
    getItem(
      "Profile",
      "8",
      <AccountBoxIcon style={{ fontSize: "large", marginRight: "-2px" }} />,
      handleMenuClick
    ),
    getItem("Users", "2", <UserOutlined />, handleMenuClick),
    getItem("Packages", "3", <OrderedListOutlined />, handleMenuClick),
    getItem("Menus", "4", <BorderColorSharpIcon />, handleMenuClick),
    getItem("Past Menus", "5", <FormOutlined />, handleMenuClick),
    getItem("Holidays", "10", <CalendarOutlined />, handleMenuClick),
    getItem("Settings", "6", <SettingOutlined />, handleMenuClick),
    // Conditionally add the "Admins" menu item based on the showAdmins state
    // showAdmins && getItem("Admins", "9", <SettingOutlined />, handleMenuClick),
    getItem("Log out", "7", <LogoutSharpIcon />, handleLogout),
  ];

  if (showAdmins) {
    // Only add the "Admins" option if showAdmins is true
    items.splice(
      2,
      0,
      getItem("Admins", "9", <AdminPanelSettingsIcon />, handleMenuClick)
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ backgroundColor: "white" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "64px",
          }}
        >
          <h2
            style={{
              display: collapsed ? "none" : "flex",
              justifyContent: "center",
              padding: 0,
              margin: "0 auto",
              marginLeft: "30px",
              color: "#00B0F0",
              fontSize: "1.45rem",
            }}
          >
            Portal
          </h2>
          <Button
            type="text"
            icon={
              collapsed ? <RightOutlined /> : <RightOutlined rotate={180} />
            }
            style={{ marginLeft: "auto", marginRight: "1em", margin: "0 auto" }}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[selectedKey]}
          mode="inline"
          style={{
            color: "black",
            marginTop: "20px",
            backgroundColor: "white",
          }}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => item.onClick(item.key)}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </div>
  );
};

export default Sidebar;
