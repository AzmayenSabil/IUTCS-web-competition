import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/NavbarSelectedItemStyle.css";
import moment from "moment";
import addNotification from "react-push-notification";
import axios from "axios";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import alertSound from "../../assets/alertSound2.mp3";
import BirthdayEventWishingLayout from "../event/birthdayEvent/BirthdayEventWishingLayout";
import breakfastReminderIcon from "../../assets/breakfastReminderIcon.png";
import lunchReminderIcon from "../../assets/lunchReminderIcon.png";
import { Progress } from "antd";

export default function ClientNavbarLayout() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [breakfastEndTime, setbreakfastEndtime] = useState("");
  const [lunchEndTime, setlunchEndTime] = useState("");
  const [showBreakfastNotificationMessage, setBreakfastNotificationMessage] =
    useState("");
  const [showLunchNotificationMessage, setLunchNotificationMessage] =
    useState("");
  const [showBirthdayEvent, setBirthdayEvent] = useState("");
  const [
    showBreakfastOrderDoneByLoggedInUser,
    setBreakfastOrderDoneByLoggedInUser,
  ] = useState("");
  const [showLunchOrderDoneByLoggedInUser, setLunchOrderDoneByLoggedInUser] =
    useState("");

  // const [employeeImage, setEmployeeImage] = useState("")
  // const [employeeID, setEmployeeID] = useState("")

  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const base_url = process.env.REACT_APP_BASE_URL;

  // useEffect(() => {
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       console.log("Notification permission granted.");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/client-profile/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;

        const name = data.token;

        // setEmployeeImage(data.data.userProfileData.passport_size_photo)
        // setEmployeeID(data.data.userProfileData.user_id)

        setProfileData(data.data.userProfileData);
      } catch (error) {
        console.error(error);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        const response = await axios.get(`${base_url}/api/v1/client/settings`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { data } = response;

        const breakfastSetting = data.data.find(
          (setting) => setting.name === "Breakfast"
        );
        const breakfastEndTimeValue = breakfastSetting.value;

        const lunchSetting = data.data.find(
          (setting) => setting.name === "Lunch"
        );
        const lunchEndTimeValue = lunchSetting.value;

        const breakfastNotification = data.data.find(
          (setting) => setting.name === "BreakfastNotification"
        );
        const lunchNotification = data.data.find(
          (setting) => setting.name === "LunchNotification"
        );

        setbreakfastEndtime(breakfastEndTimeValue);
        setlunchEndTime(lunchEndTimeValue);
        setBreakfastNotificationMessage(breakfastNotification.value);
        setLunchNotificationMessage(lunchNotification.value);
        //console.log(breakfastEndTime,lunchEndTime,showLunchNotificationMessage,showBreakfastNotificationMessage)

        // console.log(data.isOrderCompletedByLoggedInUser.length);
        setBreakfastOrderDoneByLoggedInUser(
          data.isBreakfastOrderCompletedByLoggedInUser.length
        );
        setLunchOrderDoneByLoggedInUser(
          data.isLunchOrderCompletedByLoggedInUser.length
        );
      } catch (error) {
        console.log(error);
        // Handle error state or display an error message
      }
    };

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  const notifyBreakfast = () => {
    setIsMuted(true);
    // if (Notification.permission === "granted") {
    //   new Notification("Breakfast Reminder", {
    //     body: showBreakfastNotificationMessage,
    //     icon: {mealNotificationIcon} // Replace with actual icon path
    //   });
    // }
    addNotification({
      title: "Breakfast Reminder",
      message: showBreakfastNotificationMessage,
      theme: "light",
      closeButton: "X",
      duration: 600000,
      vibration: 300,
      icon: breakfastReminderIcon,
      native: true,
    });

    toast.warn(showBreakfastNotificationMessage, {
      position: "top-center",
      autoClose: 600002,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }

    setIsMuted(false);
  };
  const notifyLunch = () => {
    setIsMuted(true);
    // if (Notification.permission === "granted") {
    //   new Notification("Lunch Reminder", {
    //     body: showLunchNotificationMessage,
    //     icon: {mealNotificationIcon},
    //   });
    // }
    addNotification({
      title: "Lunch Reminder",
      message: showLunchNotificationMessage,
      theme: "light",
      closeButton: "X",
      vibration: 300,
      duration: 600000,
      icon: lunchReminderIcon,
      native: true,
    });

    toast.warn(showLunchNotificationMessage, {
      position: "top-center",
      autoClose: 600002,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
    setIsMuted(false);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 300000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const dayOfWeek = currentTime.getDay();
    const timeString = currentTime.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const [timeForBreakfast] = breakfastEndTime.split(" ");
    const [breakfastHours, breakfastMinutes] = timeForBreakfast.split(":");
    const formattedBreakfastEndTime = `${breakfastHours}:${breakfastMinutes}:00`;

    const [timeForLunch] = lunchEndTime.split(" ");
    const [lunchHours, lunchMinutes] = timeForLunch.split(":");
    const formattedLunchEndTime = `${lunchHours}:${lunchMinutes}:00`;
    // console.log(formattedBreakfastEndTime)

    if (timeString === formattedBreakfastEndTime) {
      window.location.reload(true);
    }
    if (timeString === formattedLunchEndTime) {
      window.location.reload(true);
    }

    //breakfast time
    const originalBreakfastTime = new Date();
    const [hour, minute, meridiem] = breakfastEndTime.split(/:|(?=[APMapm])/); //  "AM"/"PM"

    let hour24 = parseInt(hour, 10);
    if (meridiem === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (meridiem === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    originalBreakfastTime.setHours(hour24);
    originalBreakfastTime.setMinutes(parseInt(minute, 10));
    originalBreakfastTime.setSeconds(0);

    const modifiedBreakfastTime = new Date(
      originalBreakfastTime.getTime() - 10 * 60000
    );

    const modifiedBreakfastHour = modifiedBreakfastTime.getHours();
    const modifiedBreakfastMinute = modifiedBreakfastTime.getMinutes();
    const modifiedBreakfastSecond = modifiedBreakfastTime.getSeconds();

    const formattedModifiedBreakfastTime = `${modifiedBreakfastHour
      .toString()
      .padStart(2, "0")}:${modifiedBreakfastMinute
      .toString()
      .padStart(2, "0")}:${modifiedBreakfastSecond
      .toString()
      .padStart(2, "0")}`;

    // console.log("formatted bfEndTime ",formattedModifiedBreakfastTime)

    //lunch time

    const originalLunchTime = new Date();
    const [hourForLunch, minuteForLunch, meridiemForLunch] =
      lunchEndTime.split(/:|(?=[APMapm])/); // "AM"/"PM"

    let hour24ForLunch = parseInt(hourForLunch, 10);
    if (meridiemForLunch === "PM" && hour24ForLunch !== 12) {
      hour24ForLunch += 12;
    } else if (meridiemForLunch === "AM" && hour24ForLunch === 12) {
      hour24ForLunch = 0;
    }

    originalLunchTime.setHours(hour24ForLunch);
    originalLunchTime.setMinutes(parseInt(minuteForLunch, 10));
    originalLunchTime.setSeconds(0);
    const modifiedLunchTime = new Date(
      originalLunchTime.getTime() - 10 * 60000
    );
    const modifiedLunchHour = modifiedLunchTime.getHours();
    const modifiedLunchMinute = modifiedLunchTime.getMinutes();
    const modifiedLunchSecond = modifiedLunchTime.getSeconds();

    const formattedModifiedLunchTime = `${modifiedLunchHour
      .toString()
      .padStart(2, "0")}:${modifiedLunchMinute
      .toString()
      .padStart(2, "0")}:${modifiedLunchSecond.toString().padStart(2, "0")}`;

    if (
      timeString === formattedModifiedBreakfastTime &&
      showBreakfastOrderDoneByLoggedInUser === 0 &&
      dayOfWeek !== 0 &&
      dayOfWeek !== 6
    ) {
      notifyBreakfast();
    } else if (
      timeString === formattedModifiedLunchTime &&
      showLunchOrderDoneByLoggedInUser === 0 &&
      dayOfWeek !== 0 &&
      dayOfWeek !== 6
    ) {
      notifyLunch();
    }
  }, [currentTime, lunchEndTime, breakfastEndTime]);

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("clientInfo");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
    localStorage.removeItem("breakFastToastClosed");
    localStorage.removeItem("rememberedCredentials");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={600002}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        style={{ width: "430px" }}
      />
      <audio ref={audioRef} src={alertSound} muted={isMuted} />
      {/* <BirthdayEventWishingLayout /> */}

      <nav
        className="navbar navbar-expand-lg navbar-dark "
        style={{ backgroundColor: "rgb(0, 176, 240)", padding: "15px" }}
      >
        <div className="container-fluid d-flex align-items-center">
          <NavLink
            className="navbar-brand me-4"
            to="/home"
            style={{ fontWeight: "lighter", fontSize: "25px" }}
          >
            Portal
          </NavLink>

          <ul className="navbar-nav d-flex flex-row align-items-center navbar-links">
            <li className="nav-items  mr-3">
              <NavLink className="nav-link text-white " to="/home">
                {/* <i class="fa fa-home" style={{color:"white"}} aria-hidden="true"></i> */}
                &nbsp;Home
              </NavLink>
            </li>
            <li className="nav-items  mr-3">
              <NavLink
                className="nav-link text-white"
                to="/employee-information"
              >
                {/* <i class="fas fa-user-clock" style={{color:"white"}} aria-hidden="true"></i> */}
                &nbsp;Employee List
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              {profileData && (
                <>
                  <NavLink
                    className="nav-link dropdown-toggle text-white"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-mdb-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {profileData.name} &nbsp;{" "}
                    <i className="fas fa-user mx-1"></i>
                  </NavLink>{" "}
                </>
              )}
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
                style={{ fontSize: "11px" }}
              >
                <li>
                  <NavLink className="dropdown-item" to="/client-profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/client-history">
                    History
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/reset-password">
                    Change Password
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown hover-effect"
                    style={{
                      background: "transparent",
                      textDecoration: "none",
                      padding: "4px 16px",
                      color: "black",
                      transition: "color 0.3s",
                      textAlign: "inherit",
                      display: "block",
                    }}
                    onClick={handleLogout}
                  >
                    Log out
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
