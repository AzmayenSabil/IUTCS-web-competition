import React from "react";
import loaderImage from "../../assets/emailSender.gif";

export default function ScreenLoaderLayout({ screenLoaderText }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img
          src={loaderImage}
          alt="loaderImage"
          style={{ height: "10.5rem" }}
        />
        <p>{screenLoaderText}</p>
      </div>
    </div>
  );
}
