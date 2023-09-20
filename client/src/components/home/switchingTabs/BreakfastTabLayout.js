import {
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Modal,
  DatePicker,
  Empty,
  Badge,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../../../styles/HomeTabSwitchingStyle.css";
import axios from "axios";
import orderStatusIcon from "../../../assets/order.png";
import { debounce } from "lodash";
import CurrentDateMealListLayout from "../mealList/CurrentDateMealListLayout";
import { BreakfastOrderContext } from "../../../utils/helper/context/OrderContext";
import PackageLoaderLayout from "../../screenLoader/PackageLoaderLayout";

export default function BreakfastTabLayout() {
  const [breakfastOptions, setbreakfastOptions] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedCards, setCheckedCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalVisible, setOrderModalVisible] = useState(false);
  const [modalMessage, setOrderModalMessage] = useState("");
  const [showOrderCancelModal, setOrderCancelModal] = useState(false);
  const [ordersOfAUser, setOrdersOfAUser] = useState([]);
  const [keepCancelButton, setCancelButtonAlive] = useState(false);
  const [isOrdered, setIsOrdered] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();
  const [error, setError] = useState("");
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataWithinRange, setDataWithinRange] = useState(0);
  const [breakfastEndTime, setbreakfastEndtime] = useState("");
  const [showSaveAllForDateRange, setSaveAllButtonForDateRange] =
    useState(false);
  const [currentDateBreakfastMenuId, setCurrentDateBreakfastMenuId] =
    useState("");
  const [currentDateBreakfastOrder, setCurrentDateBreakfastOrder] =
    useState(false);

  const { breakfastOrder, setBreakfastOrder } = useContext(
    BreakfastOrderContext
  );

  const [totalNumberOfBreakfast, setTotalNumberOfBreakfast] = useState("");
  const [loading, setLoading] = useState(false);

  const base_url = process.env.REACT_APP_BASE_URL;

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleDatePickerSubmit = async (event) => {
    event.preventDefault();

    if (startDate === "" && endDate === "") {
      setError("Please enter both start and end dates.");
      setDatePickerModalVisible(true);
      return;
    }

    if (startDate > endDate) {
      setError("End date must be greater than start date.");
      setDatePickerModalVisible(true);
      return;
    }

    setError("");

    if (error === "") {
      const uncheckedCards = breakfastOptions
        .filter(
          (breakfastData) =>
            !breakfastData.isOrdered &&
            (breakfastData.date === startDate ||
              breakfastData.date === endDate ||
              (breakfastData.date > startDate && breakfastData.date < endDate))
        )
        .map((breakfastData) => breakfastData.menu_id);
      setCheckedCards(uncheckedCards);
      setSaveAllButtonForDateRange(uncheckedCards.length > 0);
      
    }

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleDatePickerModalClose = () => {
    setDatePickerModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const [response, response2] = await Promise.all([
          axios.get(`${base_url}/api/v1/client/packages/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: currentPage,
              // limit: pageSize,
            },
          }),
          axios.get(`${base_url}/api/v1/client/order/menu_id/${user_id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: currentPage,
            },
          }),
        ]);

        const responseData = response.data.data;
        const response2Data = response2.data.data;

        const firstPackageDate = responseData.breakfastPackageList[0].date;
        const currentDate = new Date().toISOString().substring(0, 10);

        if (firstPackageDate === currentDate) {
          setCurrentDateBreakfastMenuId(
            responseData.breakfastPackageList[0].menu_id
          );
        }

        setTotalNumberOfBreakfast(responseData.totalNumberOfBreakfast);
        const mappedOptions = responseData.breakfastPackageList.map((item) => {
          const isOrdered = response2Data.checkMenuId.some(
            (order) => order.menu_id === item.menu_id
          );
          return {
            ...item,
            isOrdered,
          };
        });

        setDataWithinRange(mappedOptions.length);

        // Find max and min dates
        const maxDate = new Date(
          Math.max.apply(
            null,
            mappedOptions.map((item) => new Date(item.date))
          )
        );
        const minDate = new Date(
          Math.min.apply(
            null,
            mappedOptions.map((item) => new Date(item.date))
          )
        );

        const formattedMaxDate = maxDate.toISOString().substring(0, 10);
        const formattedMinDate = minDate.toISOString().substring(0, 10);

        setMaxDate(formattedMaxDate);
        setMinDate(formattedMinDate);

        setbreakfastOptions(mappedOptions);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
    };

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed

    debouncedFetchData(); // Initial fetch

    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, [currentPage, dataWithinRange]);

  const pageCount = Math.floor(totalNumberOfBreakfast / 18);

  useEffect(() => {}, [checkedCards, ordersOfAUser, breakfastOptions]);

  const handleCheckAll = (e) => {
    setCheckAll(e.target.checked);
    if (e.target.checked) {
      const allCardIds = breakfastOptions
        .filter((breakfastData) => !breakfastData.isOrdered)
        .map((breakfastData) => breakfastData.menu_id);
      setCheckedCards(allCardIds);
    } else {
      setCheckedCards([]);
    }
  };

  const handleCardCheck = (cardId, checked) => {
    if (checked) {
      setCheckedCards((prevChecked) => [...prevChecked, cardId]);
    } else {
      setCheckedCards((prevChecked) =>
        prevChecked.filter((id) => id !== cardId)
      );
    }
  };

  const accessToken = sessionStorage.getItem("accessToken");
  const user_id = sessionStorage.getItem("userData");

  const handleSaveAll = async () => {
    const checkTickets = breakfastOptions
      .filter((breakfastData) => checkedCards.includes(breakfastData.menu_id))
      .map((breakfastData) => ({
        ...breakfastData,
        isSelected: true,
      }));

    const uniqueCheckTickets = Array.from(
      new Set(checkTickets.map((item) => item.menu_id))
    ).map((menu_id) => checkTickets.find((item) => item.menu_id === menu_id));

    setbreakfastOptions((prevOptions) =>
      prevOptions.map((breakfastData) =>
        uniqueCheckTickets.some(
          (item) => item.menu_id === breakfastData.menu_id
        )
          ? { ...breakfastData, isSelected: true, isOrdered: true }
          : breakfastData
      )
    );

    try {
      const response = await axios.post(
        `${base_url}/api/v1/client/order`,
        {
          menu_ids: uniqueCheckTickets.map((item) => item.menu_id),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.code === 200) {
        showOrderModal("Order has been placed! Check your order history.");
        setIsOrdered(true);
        setSaveAllButtonForDateRange(false);
        setCheckedCards([]);
      } else {
        showOrderModal(
          "We are really sorry! Can't place an order at this moment."
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showOrderModal("Order could not be placed! Please try again or select menus correctly.");
    }
  };

  const showOrderModal = (message) => {
    setOrderModalMessage(message);
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setOrderModalVisible(false);
  };

  const handleOrder = async (cardId) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const user_id = sessionStorage.getItem("userData");

      const response = await axios.post(
        `${base_url}/api/v1/client/order`,
        {
          menu_ids: [cardId],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (currentDateBreakfastMenuId === cardId) {
        setCurrentDateBreakfastOrder(true);
        setBreakfastOrder(true);
      }

      if (response.data.code === 200) {
        showOrderModal("Order has been placed! Check your order history.");

        const updatedbreakfastOptions = breakfastOptions.map(
          (breakfastData) => {
            if (breakfastData.menu_id === cardId) {
              return {
                ...breakfastData,
                isOrdered: true,
              };
            }
            return breakfastData;
          }
        );

        setbreakfastOptions(updatedbreakfastOptions);
        setCheckedCards((prevCheckedCards) =>
          prevCheckedCards.filter((id) => id !== cardId)
        );
      } else {
        showOrderModal(
          "We are really sorry! Can't place an order at this moment."
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showOrderModal("Order could not be placed! Please try again or select menus correctly.");
    }
  };

  const handleCancelClick = (menu_id) => {
    setModalText("Are you sure you want to cancel?");
    setSelectedMenuId(menu_id);
    setOrderCancelModal(true);
  };

  const handleNoOrderCancelModal = () => {
    setOrderCancelModal(false);
    setCancelButtonAlive(false);
  };

  const handleYesOrderCancelModal = async () => {
    try {
      const response = await axios.delete(
        `${base_url}/api/v1/client/order/${selectedMenuId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (currentDateBreakfastMenuId === selectedMenuId) {
        setCurrentDateBreakfastOrder(false);
        setBreakfastOrder(false);
      }

      if (response.data.code === 200) {
        // Update breakfast options state after canceling
        setbreakfastOptions((prevOptions) =>
          prevOptions.map((breakfastData) =>
            breakfastData.menu_id === selectedMenuId
              ? { ...breakfastData, isOrdered: false, isSelected: false } // Set isOrdered and isSelected to false for the canceled option
              : breakfastData
          )
        );
        // Update checkedCards to remove the canceled card
        setCheckedCards((prevChecked) =>
          prevChecked.filter((id) => id !== selectedMenuId)
        );
        setCheckAll(false);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      showOrderModal("Can't cancel your order now! Please try again.");
    }

    setOrderCancelModal(false);
    setCancelButtonAlive(false);
    setSaveAllButtonForDateRange(false);
  };

  const handleModalOk = () => {
    setShowModal(false);
    setCancelButtonAlive(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(`${base_url}/api/v1/client/settings`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { data } = response;

        setbreakfastEndtime(data.data[0].value);
      } catch (error) {
        console.log(error);
      }
    };

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  useEffect(() => {
    const checkMenuIdExist = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/v1/client/order/menu_id/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: currentPage,
            },
          }
        );

        const allMenuId = response.data.data.checkMenuId;

        setOrdersOfAUser(allMenuId);
      } catch (error) {
        console.error(error);
      }
    };
    checkMenuIdExist();
  }, [isOrdered, currentPage]);

  const checkIfMenuIdExists = (menu_id) => {
    return breakfastOptions.some(
      (order) => order.menu_id === menu_id && order.isOrdered === true
    );
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    setCheckAll(false);
    setStartDate("");
    setEndDate("");
    if (page < 1) {
      setCurrentPage(page + 1);
    }
    if (page > pageCount) {
      setCurrentPage(pageCount);
    }
  };

  return (
    <>
      {/* <CurrentDateMealListLayout isBreakfastOrdered={currentDateBreakfastOrder} /> */}
      <div>
        <Modal
          open={modalVisible}
          onOk={closeOrderModal}
          onCancel={closeOrderModal}
          footer={null}
          style={{ maxHeight: "60vh" }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <img
              src={orderStatusIcon}
              alt="Alert"
              style={{ marginRight: 10 }}
            />
            <h5 style={{ margin: 0 }}>Order Status</h5>
          </div>
          <p>{modalMessage}</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                backgroundColor: "rgb(0, 176, 224)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
              onClick={closeOrderModal}
            >
              OK
            </button>
          </div>
        </Modal>
      </div>
      <>
        {loading ? (
          //  <div style={{ textAlign: "center", marginTop: "90px" }}>
          //  <Spin size="large" tip="Data Loading...">
          //   <div className="content"  />

          // </Spin>
          // </div>
          <PackageLoaderLayout screenLoaderText="Loading Breakfast Package List..." />
        ) : dataWithinRange === 0 ? (
          <Empty
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "100px",
            }}
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <p style={{ color: "#ababab" }}>
                {" "}
                There are currently no Breakfast Package to display.
              </p>
            }
          />
        ) : (
          <>
            <Row
              className="card-row"
              style={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Checkbox
                  checked={checkAll}
                  onChange={handleCheckAll}
                  style={{
                    marginBottom: "5px",
                    display:
                      breakfastOptions.some(
                        (breakfastData) =>
                          !checkIfMenuIdExists(breakfastData.menu_id) &&
                          !breakfastData.isSelected
                      ) && breakfastOptions.length > 0
                        ? "flex"
                        : "none",
                    width: "fit-content",
                  }}
                >
                  Check all
                </Checkbox>
              </Col>
              <br />

              <Col
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ textAlign: "right" }}
              >
                <form action="POST">
                  <Button
                    size="small"
                    onClick={handleSaveAll}
                    style={{
                      display:
                        (showSaveAllForDateRange ||
                          checkAll || 
                          checkedCards.length > 0) &&
                        // checkedCards.length > 0 &&
                        breakfastOptions.some(
                          (breakfastData) =>
                            !checkIfMenuIdExists(breakfastData.menu_id) &&
                            !breakfastData.isSelected
                        )
                          ? "inline-flex"
                          : "none",
                      alignItems: "center",
                      color: "white",
                      backgroundColor: "rgb(0, 176, 224)",
                      padding: "10px",
                      borderRadius: "7px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Place Order
                  </Button>
                </form>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div className="flex flex-wrap items-center">
                  <div
                    className="flex items-center"
                    style={{ flexWrap: "wrap" }}
                  >
                    {!breakfastOptions.every(
                      (breakfastData) => breakfastData.isOrdered
                    ) ? (
                      <form
                        onSubmit={handleDatePickerSubmit}
                        className="d-flex align-items-center datePicker-form"
                      >
                        <div className="form-group mr-3">
                          <label htmlFor="startDate">From :</label>
                          <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={startDate}
                            min={minDate}
                            max={maxDate}
                            onChange={handleStartDateChange}
                            placeholder="Select a date"
                          />
                        </div>
                        <div className="form-group mr-3"></div>
                        <div className="form-group mr-3">
                          <label htmlFor="endDate">To :</label>
                          <input
                            type="date"
                            id="endDate"
                            className="form-control"
                            min={minDate}
                            max={maxDate}
                            value={endDate}
                            onChange={handleEndDateChange}
                          />
                        </div>
                        <Modal
                          title="Invalid Date Input"
                          open={datePickerModalVisible}
                          onCancel={handleDatePickerModalClose}
                          onOk={handleDatePickerModalClose}
                          okText="Ok"
                          okButtonProps={{
                            style: { backgroundColor: "rgb(0, 176, 240)" },
                          }}
                          cancelButtonProps={{ style: { display: "none" } }}
                        >
                          <span>{error}</span>
                        </Modal>
                        <div className="form-group mt-3">
                          <button
                            type="submit"
                            style={{
                              backgroundColor: "rgb(0, 176, 240)",
                              color: "white",
                              padding: "5px 10px",
                              fontSize: "14px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              display: "block",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                            className="datePickerButton"
                          >
                            Select Date
                          </button>
                        </div>
                      </form>
                    ) : null}
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: "10px" }}>
              {breakfastOptions.map((breakfastData) => {
                const { meal_details, menu_id, date, day, isOrdered } =
                  breakfastData;
                var doesExist = checkIfMenuIdExists(menu_id);
                return (
                  <Col key={menu_id} xs={24} sm={12} md={8} lg={6} xl={4}>
                    <Card
                      className="custom-card"
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
                          <strong>{date}</strong>
                        </span>
                        {!doesExist && (
                          <Checkbox
                            checked={checkedCards.includes(menu_id)}
                            onChange={(e) =>
                              handleCardCheck(menu_id, e.target.checked)
                            }
                            style={{
                              display: breakfastData.isSelected
                                ? "none"
                                : "flex",
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="card-text"
                        style={{ margin: "0", paddingBottom: "7px" }}
                      >
                        {day}
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
                          {meal_details}
                        </small>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "4px",
                        }}
                      >
                        <Button
                          type={isOrdered ? "danger" : "primary"}
                          size="small"
                          className="custom-button"
                          onClick={
                            isOrdered
                              ? () => handleCancelClick(menu_id)
                              : () => handleOrder(menu_id)
                          }
                          style={{
                            backgroundColor: isOrdered
                              ? "rgb(220, 20, 60)"
                              : "rgb(0, 176, 224)",
                            color: "white",
                          }}
                        >
                          <i
                            className={`fa ${
                              isOrdered
                                ? "fas fa-times-circle"
                                : "fa fa-shopping-cart"
                            }`}
                          ></i>{" "}
                          &nbsp;
                          {isOrdered ? <span>Cancel</span> : "Order"}
                        </Button>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </>
      <Row>
        <form>
          <Modal
            title="Confirmation"
            open={showModal}
            style={{ display: "grid" }}
            onCancel={handleCancel}
            footer={[
              <Button
                key="ok"
                type="primary"
                style={{ backgroundColor: "rgb(0,176,224)" }}
                onClick={handleModalOk}
              >
                OK
              </Button>,
            ]}
          >
            <p>{modalText}</p>
          </Modal>
        </form>
      </Row>
      {/* cancel modal */}
      <Row>
        <form>
          <Modal
            title="Confirmation"
            open={showOrderCancelModal}
            closable={false}
            style={{ display: "grid" }}
            onCancel={handleCancel}
            footer={[
              <>
                <Button
                  key="ok"
                  type="primary"
                  style={{ backgroundColor: "rgb(0,176,224)" }}
                  onClick={handleNoOrderCancelModal}
                >
                  No
                </Button>
                <Button
                  key="ok"
                  type="primary"
                  style={{ backgroundColor: "rgb(220,20,60)" }}
                  onClick={handleYesOrderCancelModal}
                >
                  Yes
                </Button>
              </>,
            ]}
          >
            <p>{modalText}</p>
          </Modal>
        </form>
      </Row>

      {/* pagination  */}

      <Row style={{ justifyContent: "center", bottom: "0" }}>
        <div style={{ marginTop: "70px" }}>
          <Button
            onClick={() => handlePaginationChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span style={{ margin: "0 10px" }}>{currentPage}</span>

          {dataWithinRange === 0 ? (
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
            dataWithinRange > 0 && (
              <Button
                onClick={() => handlePaginationChange(currentPage + 1)}
                disabled={currentPage === pageCount}
              >
                Next
              </Button>
            )
          )}
        </div>
      </Row>
    </>
  );
}
