import React, { useState, useEffect } from "react";
import { Table, Pagination, Button, Empty, Avatar } from "antd";
import axios from "axios";
import { Chip } from "@mui/material";
import breakfastIcon from "../../assets/breakfastOrederingIcon.png";
import lunchIcon from "../../assets/lunchOrderingIcon3.png";
import { debounce } from "lodash";

export default function OrderHistoryTable() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const base_url = process.env.REACT_APP_BASE_URL;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "6%",
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "4%",
      align: "right",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/order/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: currentPage,
            },
          }
        );

        const { data } = response;
        setOrderHistory(data.data.clientOrderHistory);
      } catch (error) {
        console.error(error);
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

  const data = orderHistory.map((order, index) => {
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
  };

  return (
    <>
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <Button
          onClick={() => handlePaginationChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span style={{ margin: "0 10px" }}>{currentPage}</span>

        {orderHistory.length === 0 ? (
          <Button
            style={{
              backgroundColor: "rgb(245, 245, 245)",
              cursor: "not-allowed",
              color: "rgb(206,183,183)",
              border: "1px solid rgb(206,183,183)",
            }}
          >
            Next
          </Button>
        ) : (
          orderHistory.length > 0 && (
            <Button onClick={() => handlePaginationChange(currentPage + 1)}>
              Next
            </Button>
          )
        )}
      </div>

      {orderHistory.length > 0 ? (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{ marginTop: "30px" }}
          size="small"
        />
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <p style={{ color: "#ababab" }}>
                {" "}
                No further Order History available.
              </p>
            }
          />
        </div>
      )}
    </>
  );
}
