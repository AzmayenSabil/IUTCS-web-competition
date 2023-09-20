import React, { useEffect } from "react";
import axios from "axios";
import "../../../styles/BirthdayEventListStyle.css";
import { useMemo, useState } from "react";
import {
  Button,
  Empty,
  Divider,
  Popover,
  Segmented,
  Avatar,
  Spin,
  Card,
  Skeleton,
  Switch,
  Badge,
  Space,
} from "antd";
import upcomingBirthdayIcon from "../../../assets/birthdayCakeIcon2.gif";
import Meta from "antd/es/card/Meta";
import { debounce } from "lodash";
import birthdayEmployeeProfileIcon from "../../../assets/clientProfileImage.png";
const text = (
  <span style={{ fontSize: "10.5px" }}>
    &nbsp;&nbsp;&nbsp;&nbsp;Happy Birthday to Our Celebrating Colleagues{" "}
  </span>
);
const defaultText = (
  <span style={{ fontSize: "10.5px", textAlign: "center" }}>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Upcoming Birthday This Week{" "}
  </span>
);

const buttonWidth = 65;
export default function BirthdayEventListLayout() {
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setShouldFlip((prevFlip) => !prevFlip);
    }, 1500);

    return () => {
      clearInterval(flipInterval);
    };
  }, []);

  const [showArrow, setShowArrow] = useState(true);
  const [arrowAtCenter, setArrowAtCenter] = useState(false);
  const [showBirthdayEventList, setBirthdayEventList] = useState("");
  const [
    showTotalBirthdayEventOnCurrentDate,
    setTotalBirthdayEventOnCurrentDate,
  ] = useState("");
  const [showBirthdayEventNotification, setBirthdayEventNotification] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const weekday = currentDate.toLocaleString("default", { weekday: "long" });

  const formattedDay = String(day).padStart(2, "0");

  const formattedDate = `${formattedDay} ${month}, ${weekday}`;

  const mergedArrow = useMemo(() => {
    if (arrowAtCenter)
      return {
        pointAtCenter: true,
      };
    return showArrow;
  }, [showArrow, arrowAtCenter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `http://localhost:8000/api/v1/client/event-notification/birthday-event/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;

        // console.log(data)
        setBirthdayEventList(data.data.birthdayEventList);
        setTotalBirthdayEventOnCurrentDate(
          data.data.totalBirthdayEventOnCurrentDate[0]
            .total_birthday_event_on_current_date
        );
        // console.log(showTotalBirthdayEventOnCurrentDate)

        setTimeout(() => {
          setLoading(false);
        }, 1500);
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

  const content = (
    <>
      <div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        ) : showBirthdayEventList.length === 0 ? (
          <>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ fontSize: "11px" }}>No Upcoming Birthdays</span>
              }
              imageStyle={{ display: "block", margin: "0 auto", width: "40px" }}
            />
          </>
        ) : (
          <>
            {showBirthdayEventList.map((event) => {
              const shouldHighlight = event.dob === formattedDate;

              return (
                <Card
                  key={event.id}
                  className={
                    shouldHighlight
                      ? "birthday-employee-card-display"
                      : "non-birthday-employee-card-display"
                  }
                  style={{
                    width: "100%",
                    maxWidth: 230,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Meta
                      avatar={<Avatar src={birthdayEmployeeProfileIcon} />}
                      title={
                        <p style={{ fontSize: "10px" }}>
                          {event.name.split(" ").slice(0, 2).join(" ")}
                        </p>
                      }
                      description={
                        <p style={{ fontSize: "10px", marginRight: "5px" }}>
                          {event.dob}
                        </p>
                      }
                    />
                    {shouldHighlight && (
                      <p
                        style={{
                          fontSize: "10px",
                          textAlign: "center",
                          marginLeft: "5px",
                        }}
                      >
                        🎉
                      </p>
                    )}
                    {!shouldHighlight && (
                      <p
                        style={{
                          fontSize: "9px",
                          fontWeight: "bold",
                          marginTop: "5px",
                        }}
                      >
                        Upcoming Birthday
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </>
  );

  return (
    <div
      className="birthdayButton"
      style={{
        width: buttonWidth,
        float: "right",
        margin: "20px 5px 5px 5px",
        border: "none",
      }}
    >
      {showTotalBirthdayEventOnCurrentDate < 1 ? (
        <Popover
          placement="right"
          title={defaultText}
          content={content}
          arrow={mergedArrow}
        >
          <button
            style={{ border: "none", width: "80px" }}
            title="Birthday Events"
          >
            <Badge count={showTotalBirthdayEventOnCurrentDate}>
              <Avatar
                src={upcomingBirthdayIcon}
                size={40}
                className={
                  shouldFlip ? "flip-animation birthdayIcon" : "birthdayIcon"
                }
              />
            </Badge>
          </button>
        </Popover>
      ) : (
        <Popover
          placement="right"
          title={text}
          content={content}
          arrow={mergedArrow}
        >
          <button
            style={{ border: "none", width: "80px" }}
            title="Birthday Events"
          >
            <Badge count={showTotalBirthdayEventOnCurrentDate}>
              <Avatar
                src={upcomingBirthdayIcon}
                size={40}
                className={
                  shouldFlip ? "flip-animation birthdayIcon" : "birthdayIcon"
                }
              />
            </Badge>
          </button>
        </Popover>
      )}
    </div>
  );
}
