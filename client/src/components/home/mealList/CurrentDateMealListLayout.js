import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Badge, Card, Tag, Empty, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "../../../styles/MealListDisplayStyle.css";
import { debounce } from "lodash";
import axios from "axios";
import {
  BreakfastOrderContext,
  LunchOrderContext,
} from "../../../utils/helper/context/OrderContext";
const ribbonTextStyle = {
  color: "black",
};
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 45,
      color: "rgb(0,176,240)",
    }}
    spin
  />
);

export default function CurrentDateMealListLayout() {
  const [currentDateBreakfastMeal, setCurrentDateBreakfastMeal] = useState("");
  const [currentDateLunchMeal, setCurrentDateLunchtMeal] = useState("");
  const [currentDateMealAvailable, setCurrentDateMealAvailable] = useState("");
  const [isCurrentDateBreakfastAvailable, setCurrentDateBreakfastAvailable] =
    useState("");
  const [isCurrentDateLunchAvailable, setCurrentDateLunchAvailable] =
    useState("");
  const [isCurrentDateBreakfastOrdered, setCurrentDateBreakfastOrdered] =
    useState("");
  const [isCurrentDateLunchOrdered, setCurrentDateLunchOrdered] = useState("");

  const { breakfastOrder, setBreakfastOrder } = useContext(
    BreakfastOrderContext
  );
  const { lunchOrder, setLunchOrder } = useContext(LunchOrderContext);

  // const [breakfastOrderTemp, setBreakfastOrderTemp] = useState(breakfastOrder)
  // const [lunchOrderTemp, setLunchOrderTemp] = useState(lunchOrder)

  const [loading, setLoading] = useState(true);

  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/display/current-date-meal-list/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;

        setCurrentDateMealAvailable(
          data.data.currentDateBreakfastMeal.total_breakfast +
            data.data.currentDateLunchMeal.total_lunch
        );
        setCurrentDateLunchAvailable(
          data.data.currentDateLunchMeal.total_lunch
        );
        setCurrentDateBreakfastAvailable(
          data.data.currentDateLunchMeal.total_breakfast
        );
        setCurrentDateBreakfastMeal(data.data.currentDateBreakfastMeal);
        setCurrentDateLunchtMeal(data.data.currentDateLunchMeal);
        setCurrentDateBreakfastOrdered(
          data.data.isCurrentDateBreakfastOrdered.breakfast_ordered
        );
        setCurrentDateLunchOrdered(
          data.data.isCurrentDateLunchOrdered.lunch_ordered
        );
      } catch (error) {
        console.log(error);
        // Handle error state or display an error message
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
    };

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        className="todays-meal-header"
        style={{
          textAlign: "center",
          marginBottom: "10px",
          marginTop: "23px",
          marginLeft: "70px",
        }}
      >
        <h3 style={{ fontSize: "20px" }}>Today's meal</h3>
      </div>

      {loading ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100px",
          }}
        >
          <Spin size="large" indicator={antIcon} style={{ marginTop: "30px",marginLeft:"10px" }}>
            <div className="content" style={{ marginTop: "50px" }} />
          </Spin>
        </div>
      ) : (
        <Row
          gutter={16}
          //   className="todays-meal-card"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {currentDateMealAvailable === 0 ? (
            <Empty
              style={{ justifyContent: "center", alignItems: "center" }}
              image={Empty.PRESENTED_IMAGE_DEFAULT}
              description={
                <p style={{ color: "#ababab" }}> No Meal Available Today !</p>
              }
            />
          ) : (
            <div
              className="todays-meal-card"
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginRight: "70px",
              }}
            >
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {isCurrentDateBreakfastAvailable === 0 ? (
                  <Empty
                    style={{ justifyContent: "center", alignItems: "center" }}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <p style={{ color: "#ababab" }}>
                        {" "}
                        No Breakfast Available !
                      </p>
                    }
                  />
                ) : (
                  <>
                    {/* <Badge.Ribbon
                      text={currentDateBreakfastMeal.meal}
                      style={{ "--ribbon-text-color": "black" }}
                      color="#CAEFD1"
                    //   placement="end"
                    > */}
                    <Card
                      className="custom-card-for-today"
                      headStyle={{
                        padding: "8px 0px 0px 10px",
                        margin: "0 auto",
                      }}
                      bodyStyle={{
                        paddingTop: "3px",
                        paddingLeft: "10px",
                        paddingBottom: "5px",
                        paddingRight: "3px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="">
                          <strong>{currentDateBreakfastMeal.date}</strong>
                        </span>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "#CAEFD1", // Background color of the badge
                            color: "black", // Text color of the badge
                            padding: "8px 8px", // Adjust padding as needed
                            borderRadius: "4px", // Border radius to round the badge
                          }}
                        >
                          {currentDateBreakfastMeal.meal}
                        </span>
                      </div>
                      <p
                        className="card-text"
                        style={{ margin: "0", paddingBottom: "7px" }}
                      >
                        {currentDateBreakfastMeal.day}
                      </p>
                      <hr style={{ margin: "0", padding: "0" }} />
                      <span style={{ marginBottom: "10px" }}></span>

                      <div
                        className="fixed-height-container"
                        style={{ height: "90px", paddingTop: "2px" }}
                      >
                        <small className="text-muted ">
                          <u>Meal Details</u>
                          <br />
                          {currentDateBreakfastMeal.meal_details}
                        </small>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "4px",
                        }}
                      >
                        {breakfastOrder === undefined ? (
                          isCurrentDateBreakfastOrdered === 1 ? (
                            <Tag color="success" bordered={true}>
                              Ordered
                            </Tag>
                          ) : (
                            <Tag color="error" bordered={true}>
                              Not Ordered
                            </Tag>
                          )
                        ) : breakfastOrder !== false ? (
                          <Tag color="success" bordered={true}>
                            Ordered
                          </Tag>
                        ) : (
                          <Tag color="error" bordered={true}>
                            Not Ordered
                          </Tag>
                        )}
                      </div>
                    </Card>
                    <style>
                      {`
                            .ant-ribbon .ant-ribbon-text {
                                color: var(--ribbon-text-color, inherit);
                            }
                        `}
                    </style>
                    {/* </Badge.Ribbon> */}
                  </>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {isCurrentDateLunchAvailable === 0 ? (
                  <Empty
                    style={{ justifyContent: "center", alignItems: "center" }}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <p style={{ color: "#ababab" }}> No Lunch Available !</p>
                    }
                  />
                ) : (
                  <>
                    {/* <Badge.Ribbon
                      text={currentDateLunchMeal.meal}
                      style={{ "--ribbon-text-color": "black" }}
                      color="#FFF2CD"
                    > */}
                    <Card
                      className="custom-card-for-today"
                      headStyle={{
                        padding: "8px 0px 0px 10px",
                        margin: "0 auto",
                      }}
                      bodyStyle={{
                        paddingTop: "3px",
                        paddingLeft: "10px",
                        paddingBottom: "5px",
                        paddingRight: "3px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="">
                          <strong>{currentDateLunchMeal.date}</strong>
                        </span>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "#FFF2CD", // Background color of the badge
                            color: "black", // Text color of the badge
                            padding: "8px 8px", // Adjust padding as needed
                            borderRadius: "4px", // Border radius to round the badge
                          }}
                        >
                          {currentDateLunchMeal.meal}
                        </span>
                      </div>
                      <p
                        className="card-text"
                        style={{ margin: "0", paddingBottom: "7px" }}
                      >
                        {currentDateLunchMeal.day}
                      </p>
                      <hr style={{ margin: "0", padding: "0" }} />
                      <span style={{ marginBottom: "10px" }}></span>

                      <div
                        className="fixed-height-container"
                        style={{ height: "90px", paddingTop: "2px" }}
                      >
                        <small className="text-muted ">
                          <u>Meal Details</u>
                          <br />

                          {currentDateLunchMeal.meal_details}
                        </small>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "4px",
                        }}
                      >
                        {lunchOrder === undefined ? (
                          isCurrentDateLunchOrdered === 1 ? (
                            <Tag color="success" bordered={true}>
                              Ordered
                            </Tag>
                          ) : (
                            <Tag color="error" bordered={true}>
                              Not Ordered
                            </Tag>
                          )
                        ) : lunchOrder !== false ? (
                          <Tag color="success" bordered={true}>
                            Ordered
                          </Tag>
                        ) : (
                          <Tag color="error" bordered={true}>
                            Not Ordered
                          </Tag>
                        )}
                      </div>
                    </Card>
                    <style>
                      {`
                            .ant-ribbon .ant-ribbon-text {
                                color: var(--ribbon-text-color, inherit);
                            }
                        `}
                    </style>
                    {/* </Badge.Ribbon> */}
                  </>
                )}
              </Col>
            </div>
          )}
        </Row>
      )}
    </div>
  );
}
