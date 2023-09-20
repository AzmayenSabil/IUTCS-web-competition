import React from "react";
import profileScreenLoader from "../../assets/loaderForMealTime.gif";
export default function HolidayLoaderLayout({ screenLoaderText }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img
          src={profileScreenLoader}
          alt="loaderImage"
          style={{ height: "10.5rem" }}
        />
        <p>{screenLoaderText}</p>
      </div>
    </div>
  );
}