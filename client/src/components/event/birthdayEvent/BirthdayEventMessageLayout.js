import React from "react";
import { Avatar, Card, Skeleton, Switch } from "antd";
import Meta from "antd/es/card/Meta";
import birthdayCakeIcon from "../../../assets/birthdayCakeIcon.png";
const BirthdayMessage = ({ birthdayEmployeeName }) => {
  // console.log(birthdayEmployeeName)
  return (
    <>
      <Card
        style={{
          //   width: 300,
          //   marginTop: 16,
          width: 310,
          fontSize: 13,

          border: "none",
        }}
      >
        <Meta
          avatar={<Avatar src={birthdayCakeIcon} />}
          title={
            <h2
              style={{ fontSize: "15px", marginBottom: "3px" }}
            >{`Happy Birthday ${birthdayEmployeeName} 🎉`}</h2>
          }
          description={
            <p
              style={{ fontSize: "12px" }}
            >{`Warmest wishes from DreamOnline Family`}</p>
          }
        />
      </Card>
    </>
  );
};

export default BirthdayMessage;
