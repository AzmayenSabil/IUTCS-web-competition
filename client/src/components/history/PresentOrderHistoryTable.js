import React, { useState, useEffect } from "react";
import { Table, Pagination, Button, Empty, Avatar, Spin, Badge } from "antd";
import axios from "axios";
import { Chip } from "@mui/material";
import breakfastIcon from "../../assets/breakfastOrederingIcon.png";
import lunchIcon from "../../assets/lunchOrderingIcon3.png";
import { debounce } from "lodash";
import "../../styles/OrderHistorySpinnerStyle.css";
import OrderHistoryLoaderLayout from "../screenLoader/OrderHistoryLoaderLayout";
export default function PresentOrderHistoryTable() {
  const [presentOrderHistory, setPresentOrderHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalOrderOfLoggedInUser, setTotalOrderOfLoggedInUser] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "3%",
      align: "left",
    },
    {
      title: "Menu",
      dataIndex: "menu",
      key: "menu",
      align: "center",
      width: "7%",
    },
    {
      title: "Ordered Time",
      dataIndex: "orderTime",
      key: "orderTime",
      width: "3%",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "3%",
      align: "right",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/order/present-orders/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: currentPage,
              // limit: pageSize,
            },
          }
        );

        const { data } = response;
        setPresentOrderHistory(data.data.clientOrderHistory);
        // console.log(data.data.getTotalOrders
        //   )
        setTotalOrderOfLoggedInUser(data.data.getTotalOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    // fetchData();
    const debouncedFetchData = debounce(fetchData, 500); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, [currentPage]);

  const pageCount = Math.ceil(totalOrderOfLoggedInUser / 8);

  const data = presentOrderHistory.map((order, index) => {
    let iconSrc = order.type === "Breakfast" ? breakfastIcon : lunchIcon;
    let chipBackgroundColor =
      order.type === "Breakfast" ? "#CAEFD1" : "#fff2cd";
    return {
      key: index,
      date: (
        <div>
          {order.date},&nbsp;
          {order.weekDay}
        </div>
      ),
      menu: order.menu,
      orderTime: (
        <div>
          {order.orderDate},&nbsp;
          {order.orderTime}
        </div>
      ),
      type: (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Chip
            avatar={<Avatar alt="orderTypeImg" src={iconSrc} />}
            label={order.type}
            size="small"
            style={{
              width: "95px",
              display: "flex",
              backgroundColor: chipBackgroundColor,
              borderRadius: 0,
            }}
          />
        </div>
      ),
    };
  });

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    if (page < 1) {
      setCurrentPage(page + 1);
    }
    if (page > pageCount) {
      setCurrentPage(pageCount);
    }
  };

  return (
    <>
      <>
        <Badge.Ribbon
          text="Upcoming Orders"
          color="rgb(0,176,240)"
          placement="start"
        >
          <h4 style={{ fontSize: "19px" }} className="text-muted"></h4>
        </Badge.Ribbon>
      </>
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <Button
          onClick={() => handlePaginationChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span style={{ margin: "0 10px" }}>{currentPage}</span>

        {presentOrderHistory.length > 0 && (
          <Button
            onClick={() => handlePaginationChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        )}
        {loading && (
          // <div style={{ textAlign: "center", marginTop: "90px" }}>
          //  <Spin size="large" tip="Data Loading...">
          //   <div className="content"  />

          // </Spin>
          // </div>
          <OrderHistoryLoaderLayout screenLoaderText="Loading Order History..." />
        )}
      </div>

      {presentOrderHistory.length > 0 && !loading ? (
        <>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            style={{ marginTop: "30px" }}
            size="small"
          />
        </>
      ) : totalOrderOfLoggedInUser === 0 && !loading ? (
        <div style={{ textAlign: "center", marginTop: "140px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <p style={{ color: "#ababab" }}>No Order History found !</p>
            }
          />
        </div>
      ) : null}
    </>
  );
}
