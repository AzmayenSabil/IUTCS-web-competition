import React from "react";
import ClientHomeLayout from "../../components/home/ClientHomeLayout";
import ClientNavbarLayout from "../../components/navbar/ClientNavbarLayout";
import instructionDirection from "../../assets/direction.png";

import TabTitle from "../../utils/TabTitle";
export default function ClientHomePage() {
  TabTitle("Portal - Home");
  return (
    <>
      <ClientNavbarLayout />
      <ClientHomeLayout
        orderPlacingInstructionMessage={
          <>
            <i
              style={{
                fontSize: "12px",
                margin: "0",
                marginBottom: "1.5px",
                textAlign: "justify",
                color: "rgb(0, 176, 240)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={instructionDirection}
                width="12px"
                alt=""
                style={{ marginRight: "5px" }}
              />{" "}
              Click "Order" to purchase a single package.
              <br />
            </i>
            <i
              style={{
                fontSize: "12px",
                margin: "0",
                marginBottom: "1.5px",
                textAlign: "justify",
                color: "rgb(0, 176, 240)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={instructionDirection}
                width="12px"
                alt=""
                style={{ marginRight: "5px" }}
              />{" "}
              Use "Check All" to order multiple packages.
              <br />
            </i>
            <i
              style={{
                fontSize: "12px",
                margin: "0",
                marginBottom: "1.5px",
                textAlign: "justify",
                color: "rgb(0, 176, 240)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={instructionDirection}
                width="12px"
                alt=""
                style={{ marginRight: "5px" }}
              />{" "}
              Utilize date picker for multi-day package ordering.
              <br />
            </i>

            <i
              style={{
                fontSize: "12px",
                margin: "0",
                marginBottom: "1.5px",
                textAlign: "justify",
                color: "rgb(0, 176, 240)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={instructionDirection}
                width="12px"
                alt=""
                style={{ marginRight: "5px" }}
              />{" "}
              Click "Cancel" to remove an ordered package.
            </i>
          </>
        }
      />
    </>
  );
}
