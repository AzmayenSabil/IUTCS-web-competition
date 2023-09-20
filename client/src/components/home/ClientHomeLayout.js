import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Skeleton,
  Switch,
  Tooltip,
  FloatButton,
  Modal,
  Button,
} from "antd";
// import { Avatar, Card, FloatButton, Skeleton, Switch, Tooltip } from "antd";
import CheckAuth from "../authentication/common/hooks/CheckAuth";
import howToOrderIcon from "../../assets/howToOrder.png";
import HomeTabLayout from "./switchingTabs/HomeTabLayout";
import "../../styles/HomeTabSwitchingStyle.css";
import CurrentDateMealListLayout from "./mealList/CurrentDateMealListLayout";
import {
  BreakfastOrderContext,
  LunchOrderContext,
} from "../../utils/helper/context/OrderContext";
import moment from "moment";

export default function ClientHomeLayout({ orderPlacingInstructionMessage }) {
  const { Meta } = Card;
  const [breakfastOrder, setBreakfastOrder] = useState();
  const [lunchOrder, setLunchOrder] = useState();

  CheckAuth();

  return (
    <>
      <BreakfastOrderContext.Provider
        value={{ breakfastOrder, setBreakfastOrder }}
      >
        <LunchOrderContext.Provider value={{ lunchOrder, setLunchOrder }}>
          <div>
            <div
              className="header-section"
              style={{
                display: "flex",
                // justifyContent: "space-between", // This will make the two components take up space
                alignItems: "center",
                padding: "20px 70px", // Adjust the padding as needed
              }}
            >
              <Card
                className="responsive-home-card"
                style={{
                  width: 345,
                  height: "185px",
                  overflow: "auto",
                  color: "black",
                  fontSize: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  cursor: "pointer",
                  marginTop: "80px",
                }}
              >
                <Meta
                  title="Order Placement Instructions"
                  description={orderPlacingInstructionMessage}
                />
              </Card>

              <CurrentDateMealListLayout
                orderPlacingInstructionMessage={orderPlacingInstructionMessage}
              />
            </div>
          </div>
          <div className="content_wrapper" style={{ padding: "70px" }}>
            <HomeTabLayout />
          </div>
          <FloatButton.BackTop tooltip="Move Up" />
        </LunchOrderContext.Provider>
      </BreakfastOrderContext.Provider>
    </>
  );
}
