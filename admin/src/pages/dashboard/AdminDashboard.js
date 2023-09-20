import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import TabTitle from "../../utils/tabTitle/TabTitle";
import usersImage from "../../assets/users.png";
import maleUserImage from "../../assets/male.png";
import femaleUserImage from "../../assets/female.png";
import orderImage from "../../assets/orders.png";
import axios from "axios";
import { debounce } from "lodash";
import HorizontalLine from "../../utils/HorizontalLine";

const customMonthPickerStyle = {
  border: "1px solid #ccc",
  padding: "6px",
  borderRadius: "5px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f9f9f9",
  width: "100%",
  height: "48px",
};

const monthNavigationStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "10px",
  cursor: "pointer",
};

const arrowButtonStyle = {
  backgroundColor: "#f9f9f9",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
};

const monthDropdownStyle = {
  padding: "5px",
  border: "1px solid #ccc",
  borderRadius: "3px",
  fontSize: "16px",
  cursor: "pointer",
};

const selectedMonthStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const AdminDashboard = () => {
  TabTitle("Portal - Dashboard");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  // const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedMonthIndex, setSelectedMonthIndex] =
    useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handlePreviousMonth = () => {
    setSelectedMonthIndex((prevIndex) =>
      prevIndex === 0 ? 11 : prevIndex - 1
    );
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex((prevIndex) =>
      prevIndex === 11 ? 0 : prevIndex + 1
    );
  };

  const selectedMonth = months[selectedMonthIndex];
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfFemaleUser, setNumberOfFemaleUser] = useState(0);
  const [numberOfMaleUser, setNumberOfMaleUser] = useState(0);
  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchAggregatedDataForDashboardCards = async () => {
    // console.log(selectedMonth)
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${base_url}/api/v1/admin/dashboard/data`,

        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            monthIndex: selectedMonthIndex + 1,
          },
        }
      );
      const data = response.data.data;

      setNumberOfUsers(data.total_user);
      setNumberOfMaleUser(data.total_male_user);
      setNumberOfFemaleUser(data.total_female_user);
      setNumberOfOrders(data.total_order);
      // setNumberOfOrders(orders.length);
    } catch (error) {
      console.error("Error fetching aggregated data for dashboard:", error);
    }
  };

  const debouncedFetchAggregatedDataForDashboardCards = debounce(
    fetchAggregatedDataForDashboardCards,
    500
  );
  // const debouncedFetchOrders = debounce(fetchOrders, 500);

  useEffect(() => {
    debouncedFetchAggregatedDataForDashboardCards();
    // debouncedFetchOrders();

    return () => {
      // Cleanup the debounced functions
      debouncedFetchAggregatedDataForDashboardCards.cancel();
      // debouncedFetchOrders.cancel();
    };
  }, [selectedMonthIndex]);

  return (
    <div style={{ display: "flex", backgroundColor: "white", height: "100vh" }}>
      <div style={{ flex: "0 0 20px" }}>
        <Sidebar selectedKey="1" />
      </div>
      <div
        style={{
          marginLeft: "20px",
          padding: "16px",
          overflowY: "auto",
          flex: "1",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              style={{
                boxShadow: "0 12px 14px rgba(0, 0, 0, 0.2)",
                padding: "8px",
              }}
            >
              <CardContent style={{ height: "122px" }}>
                <Typography variant="h6">
                  <img
                    src={usersImage}
                    width="40px"
                    height="40px"
                    alt="userIcon"
                  />
                  &nbsp;Number of Users : {numberOfUsers}
                </Typography>
                <hr />
              </CardContent>
              <Grid
                container
                justifyContent="flex-start"
                style={{ padding: "13px" }}
              >
                <Grid item>
                  <Typography variant="body1">
                    <img
                      src={maleUserImage}
                      width="30px"
                      height="30px"
                      alt=""
                    />{" "}
                    Male users : {numberOfMaleUser}
                    <img
                      src={femaleUserImage}
                      width="30px"
                      height="30px"
                      alt=""
                      style={{ marginLeft: "50px" }}
                    />{" "}
                    Female users : {numberOfFemaleUser}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              style={{
                boxShadow: "0 12px 14px rgba(0, 0, 0, 0.2)",
                padding: "8px",
              }}
            >
              <CardContent style={{ height: "105px" }}>
                <Typography variant="h6">
                  <img
                    src={orderImage}
                    width="40px"
                    height="40px"
                    alt="userIcon"
                  />
                  &nbsp;Number of Orders : {numberOfOrders}
                </Typography>
                <hr />
                <span>
                  Selected Month: {selectedMonth} {selectedYear}
                </span>
              </CardContent>

              <CardContent style={{ padding: "13px" }}>
                <div style={customMonthPickerStyle}>
                  <div style={monthNavigationStyle}>
                    <button
                      style={arrowButtonStyle}
                      onClick={handlePreviousMonth}
                    >
                      &#8592;
                    </button>

                    <select
                      style={monthDropdownStyle}
                      value={selectedMonth}
                      onChange={(e) => {
                        const selectedMonthIndex = months.indexOf(
                          e.target.value
                        );
                        setSelectedMonthIndex(selectedMonthIndex);
                      }}
                    >
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <button style={arrowButtonStyle} onClick={handleNextMonth}>
                      &#8594;
                    </button>
                  </div>
                </div>
                {/* <hr/> */}
              </CardContent>
            </Card>
          </Grid>

          {/* Add another Grid item for the third card if needed */}
        </Grid>
      </div>
    </div>
  );
};

export default AdminDashboard;
