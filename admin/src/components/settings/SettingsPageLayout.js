import React, { useEffect, useState } from "react";
import moment from "moment";
// import cron from "node-cron";

import { TimeField } from "@mui/x-date-pickers/TimeField";
import axios from "axios";
import { debounce } from "lodash";
import { Button } from "antd";
import { Switch } from "antd";
import { Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextArea from "antd/es/input/TextArea";

const SettingsPageLayout = () => {
  const [emailFromToken, setEmailFromToken] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [lunchEndTime, setLunchEndTime] = useState("");
  const [breakfastEndTime, setBreakfastEndTime] = useState("");
  const [breakfastNotificationMessage, setBreakfastNotificationMessage] =
    useState("");
  const [lunchNotificationMessage, setLunchNotificationMessage] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;

  const [emailNotification, setEmailNotification] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const email = sessionStorage.getItem("data");
        const clientInfo = JSON.parse(sessionStorage.getItem("clientInfo"));

        //console.log(email)
        setEmailFromToken(sessionStorage.getItem("data"));
        // console.log(emailFromToken)

        const response = await axios.get(`${base_url}/api/v1/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { data } = response;

        const response2 = await axios.get(
          `${base_url}/api/v1/admin/settings/emailNotification/${clientInfo.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(response2);
        setEmailNotification(response2.data.data);

        const breakfastNotification = data.data.find(
          (setting) => setting.name === "BreakfastNotification"
        );
        const lunchNotification = data.data.find(
          (setting) => setting.name === "LunchNotification"
        );

        setBreakfastNotificationMessage(breakfastNotification?.value || "");
        setLunchNotificationMessage(lunchNotification?.value || "");

        const lunchSetting = data.data.find(
          (setting) => setting.name === "Lunch"
        );
        const lunchEndTimeValue = moment(lunchSetting.value, "HH:mm:ss").format(
          "hh:mm A"
        );

        const breakfastSetting = data.data.find(
          (setting) => setting.name === "Breakfast"
        );
        const breakfastEndTimeValue = moment(
          breakfastSetting.value,
          "HH:mm:ss"
        ).format("hh:mm A");

        setLunchEndTime(lunchEndTimeValue || "");
        setBreakfastEndTime(breakfastEndTimeValue || "");
      } catch (error) {
        console.log(error);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  const handleFormSubmit = async (settingsArray, notificationArray) => {
    try {
      const token = sessionStorage.getItem("token");

      const settingResponses = await Promise.all(
        settingsArray.map(async (setting) => {
          const response = await axios.post(
            `${base_url}/api/v1/admin/settings`,
            {
              name: setting.name,
              value: setting.value,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response;
        })
      );

      const notificationResponses = await Promise.all(
        notificationArray.map(async (notification) => {
          const response = await axios.post(
            `${base_url}/api/v1/admin/settings`,
            {
              name: notification.name,
              value: notification.value,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response;
        })
      );

      settingResponses.forEach((response, index) => {
        const setting = settingsArray[index];
        if (setting.name === "Lunch") {
          setLunchEndTime(moment(setting.value, "HH:mm:ss").format("hh:mm A"));
        } else if (setting.name === "Breakfast") {
          setBreakfastEndTime(
            moment(setting.value, "HH:mm:ss").format("hh:mm A")
          );
        }
      });

      notificationResponses.forEach((response, index) => {
        const notification = notificationArray[index];
        if (notification.name === "BreakfastNotification") {
          setBreakfastNotificationMessage(notification.value);
        } else if (notification.name === "LunchNotification") {
          setLunchNotificationMessage(notification.value);
        }
      });

      toast.success(`Saved End Times and Messages!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleEmailTriggering = async (e) => {
    let toggle;
    try {
      if (!e) {
        toggle = "no";
        Modal.confirm({
          title: (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>
                Are you sure you want to turn off email notification?
              </div>
            </div>
          ),
          centered: true,
          onOk: async () => {
            const token = sessionStorage.getItem("token");
            const clientInfo = JSON.parse(sessionStorage.getItem("clientInfo"));

            const response = await axios.post(
              `${base_url}/api/v1/admin/settings/emailNotification/${clientInfo.user_id}`,
              {
                emailNotification: toggle,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            setEmailNotification("no");
            // console.log(response.data); // Assuming the response contains data indicating success or failure
          },
          okButtonProps: { style: { marginRight: "35%" } },
          bodyStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        });
      } else {
        toggle = "yes";
        setEmailNotification("yes");
        const token = sessionStorage.getItem("token");
        const clientInfo = JSON.parse(sessionStorage.getItem("clientInfo"));

        const response = await axios.post(
          `${base_url}/api/v1/admin/settings/emailNotification/${clientInfo.user_id}`,
          {
            emailNotification: toggle,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log(response.data); // Assuming the response contains data indicating success or failure
        // Handle the response if needed
        // Reset the input fields after successful submission
      }
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleFormSubmitForBreakfastNotificationMesage = async (
    name,
    value
  ) => {
    try {
      //console.log(name, value);
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        `${base_url}/api/v1/admin/settings`,
        {
          name: name,
          value: value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBreakfastNotificationMessage(value);

      // Display a success toast message
      toast.success(`Saved Breakfast Notification Message!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // Handle success state or display a success message
      console.error(error);
      // Handle error state or display an error message
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const handleFormSubmitForLunchNotificationMesage = async (name, value) => {
    try {
      //console.log(name, value);
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        `${base_url}/api/v1/admin/settings`,
        {
          name: name,
          value: value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLunchNotificationMessage(value);

      // Display a success toast message
      toast.success(`Saved Lunch Notification Message!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // Handle success state or display a success message
      console.error(error);
      // Handle error state or display an error message
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={300000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        style={{ width: "360px" }}
      />
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "50px",
            marginLeft: "20px",
            marginBottom: "50px",
            width: "1080px",
            background: "white",
            padding: "30px",
            boxShadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
          }}
        >
          <form method="POST">
            {/* Breakfast */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                // marginTop: "20px",
              }}
            >
              <div
                style={{
                  margin: "0px 10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  width: "20%", // Adjust the width as needed
                }}
              >
                <label style={{ marginBottom: "7px" }}>
                  Breakfast End Time:
                </label>
                <TimeField
                  value={
                    breakfastEndTime
                      ? moment(breakfastEndTime, "HH:mm A")
                      : null
                  }
                  onChange={(value) => {
                    setBreakfastEndTime(
                      value ? moment(value).format("HH:mm A") : null
                    );
                  }}
                />
              </div>
              <div
                style={{
                  margin: "0px 10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  width: "60%", // Adjust the width as needed
                }}
              >
                <label style={{ marginBottom: "7px" }}>
                  Breakfast Notification Message:
                </label>
                <TextArea
                  rows={2}
                  showCount
                  maxLength={70}
                  value={breakfastNotificationMessage}
                  onChange={(e) =>
                    setBreakfastNotificationMessage(e.target.value)
                  }
                  style={{ resize: "none" }}
                />
              </div>
            </div>

            {/* Lunch */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  margin: "0px 10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  width: "20%", // Adjust the width as needed
                }}
              >
                <label style={{ marginBottom: "7px" }}>Lunch End Time:</label>
                <TimeField
                  value={lunchEndTime ? moment(lunchEndTime, "HH:mm A") : null}
                  onChange={(value) => {
                    setLunchEndTime(
                      value ? moment(value).format("HH:mm A") : null
                    );
                  }}
                />
              </div>
              <div
                style={{
                  margin: "0px 10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  width: "60%", // Adjust the width as needed
                }}
              >
                <label style={{ marginBottom: "10px" }}>
                  Lunch Notification Message:
                </label>
                <TextArea
                  rows={2}
                  showCount
                  maxLength={70}
                  value={lunchNotificationMessage}
                  onChange={(e) => setLunchNotificationMessage(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={() =>
                handleFormSubmit(
                  [
                    { name: "Breakfast", value: breakfastEndTime },
                    { name: "Lunch", value: lunchEndTime },
                  ],
                  [
                    {
                      name: "BreakfastNotification",
                      value: breakfastNotificationMessage,
                    },
                    {
                      name: "LunchNotification",
                      value: lunchNotificationMessage,
                    },
                  ]
                )
              }
              style={{
                background: "rgb(0, 176, 240)",
                marginTop: "20px",
                marginLeft: "20px",
                color: "white",
                width: "80%", // Button width to cover both sections
              }}
              block
            >
              Save All Changes &nbsp;
              {/* <img src={settingsIcon} width="25px" height="25px" alt="settingsIcon" /> */}
            </Button>
          </form>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "50px",
            marginLeft: "20px",
            width: "17%",
            background: "white",
            padding: "10px",
            boxShadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              marginTop: "10px",
              fontSize: "14px",
            }}
          >
            <span style={{ marginRight: "10px" }}>Email Notification</span>
            <Switch
              // defaultChecked
              checked={emailNotification === "yes"}
              onChange={(e) => handleEmailTriggering(e)}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPageLayout;
