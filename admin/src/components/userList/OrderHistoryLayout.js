import { Modal, Table, Pagination } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";

const orderHistoryColumn = [
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Meal Type",
    dataIndex: "mealType",
  },
  {
    title: "Menu",
    dataIndex: "menu",
  },
];

function getDayName(day) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[day];
}

const OrderHistoryModal = ({
  orderHistoryModalOpen,
  setOrderHistoryModalOpen,
  record,
}) => {
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const base_url = process.env.REACT_APP_BASE_URL;

  const handlePageChange = async (page) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${base_url}/api/v1/admin/orders/history/${record.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
        }
      );

      const { data, total_orders: total } = response.data;

      //console.log(data)

      const formattedData = data.map((order) => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toISOString().split("T")[0];
        const dayName = getDayName(orderDate.getDay());
        const dateWithDayName = `${formattedDate}\n${dayName}`;

        return {
          date: dateWithDayName,
          mealType: order.meal_type,
          menu: order.package_name,
        };
      });

      formattedData.sort((a, b) => {
        const dateA = new Date(a.date.split("\n")[0]);
        const dateB = new Date(b.date.split("\n")[0]);

        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA;
        } else {
          const mealOrder = {
            Breakfast: 1,
            Lunch: 2,
          };

          const mealTypeComparison =
            mealOrder[a.mealType] - mealOrder[b.mealType];

          return mealTypeComparison;
        }
      });

      setOrderHistoryData(formattedData);
      setTotalOrders(total);
    } catch (error) {
      console.log(error);
      // Handle error state or display an error message
    }
  };

  const debouncedFetchData = debounce(fetchData, 500);

  useEffect(() => {
    debouncedFetchData();

    return () => {
      // Cleanup the debounced function
      debouncedFetchData.cancel();
    };
  }, [currentPage, record.user_id]);

  return (
    <Modal
      title="Order History"
      centered
      open={orderHistoryModalOpen}
      onCancel={() => setOrderHistoryModalOpen(false)}
      footer={null}
      width={"600px"}
      bodyStyle={{
        maxHeight: "400px",
        minHeight: "400px",
        overflow: "auto",
      }}
    >
      <div style={{ flex: "1" }}>
        <div
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger={false}
            total={totalOrders}
            onChange={handlePageChange}
          />
        </div>
        <Table
          columns={orderHistoryColumn}
          dataSource={orderHistoryData}
          pagination={false}
        />
      </div>
    </Modal>
  );
};

export default OrderHistoryModal;
