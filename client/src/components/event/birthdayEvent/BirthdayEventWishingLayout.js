import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { debounce } from "lodash";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/BirthdayEventToastStyle.css";
import birthdayEventSound from "../../../assets/happyBirthdaySound.mp3";
import BirthdayEventMessageLayout from "./BirthdayEventMessageLayout";
import addNotification from "react-push-notification";
import birthdayCakeIcon from "../../../assets/birthdayCake.png";
export default function BirthdayEventWishingLayout() {
  const [showBirthdayEvent, setBirthdayEvent] = useState("");
  const [showBirthdayEmployeeName, setBirthdayEmployeeName] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [showBirthdayEventKey, setBirthdayEventKey] = useState(
    "showBirthdayEventKey"
  );

  //for events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `http://localhost:8000/api/v1/client/event-notification/birthday-event/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;

        if (data.data.birthdayEventNotification.length > 0) {
          setBirthdayEmployeeName(data.data.birthdayEventNotification[0].name);
          setBirthdayEvent(data.data.birthdayEventNotification);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500);
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, []);

  const notifyBirthdayPresent = () => {
    setIsMuted(true);
    toast(
      <BirthdayEventMessageLayout
        birthdayEmployeeName={showBirthdayEmployeeName}
      />,
      {
        className: "birthday-event-toast-message ",
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        transition: Zoom,
        theme: "light",
      }
    );

    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
    setIsMuted(false);
    localStorage.setItem(showBirthdayEventKey, "true");
    setTimeout(() => {
      localStorage.removeItem(showBirthdayEventKey);
    }, 24 * 60 * 60 * 1000);

    setShowConfetti(false);
  };
  useEffect(() => {
    if (showBirthdayEvent.length > 0) {
      const isEventTriggered = localStorage.getItem(showBirthdayEventKey);
      if (!isEventTriggered) {
        notifyBirthdayPresent();
        addNotification({
          title: `Happy Birthday ${showBirthdayEmployeeName}`,
          message:
            "Warmest regards to a valuable member of our team. May your great day be filled with joy, laughter, and brightness!",
          theme: "light",
          closeButton: "X",
          duration: 600000,
          vibration: 300,
          icon: birthdayCakeIcon,
          native: true,
        });
        setShowConfetti(true);
      } else {
        setShowConfetti(false);
      }
    }
  }, [showBirthdayEvent]);
  return (
    <div>
      {/* <ToastContainer
                position="bottom-right"
                autoClose={false}
                hideProgressBar={true}
                closeOnClick
                theme="colored"
                style={{ width: "330px" }}
            /> */}
      <audio ref={audioRef} src={birthdayEventSound} muted={isMuted} />
      {showBirthdayEvent.length > 0 && showConfetti && (
        <div>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={2000}
            ribboncount={1000}
            run={showBirthdayEvent.length > 0}
            // recycle={true}
          />
        </div>
      )}
    </div>
  );
}
