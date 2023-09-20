import React from "react";
import profileScreenLoader from "../../assets/loaderForMealTime.gif";
export default function EmployeeListingLoaderLayout({ screenLoaderText }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "20vh",
        marginTop: "50px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img
          src={profileScreenLoader}
          alt="loaderImage"
          style={{ height: "8.5rem" }}
        />
        <p>{screenLoaderText}</p>
      </div>
    </div>
  );
}
