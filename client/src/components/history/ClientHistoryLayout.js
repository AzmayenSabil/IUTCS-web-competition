import React from "react";
import { FloatButton } from "antd";
import AggretgatedOrderData from "./AggretgatedOrderData";
import "../../styles/OrderHistoryTableStyle.css";
import HistoryTabLayout from "./HistoryTabLayout";

const ClientHistoryLayout = () => {
  return (
    <>
      <div className="container" style={{ marginTop: "20px" }}>
        <AggretgatedOrderData />
        <p className="mt-2"></p>
        <div className="orderHistoryTableWidth">
          <HistoryTabLayout />
        </div>
        <div className="mt-7"></div>
      </div>
      <FloatButton.BackTop tooltip="Move Up" />
    </>
  );
};

export default ClientHistoryLayout;
