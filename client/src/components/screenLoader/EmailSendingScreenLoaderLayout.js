import React from "react";
import emailSendingLoader from "../../assets/emailSender.gif";
export default function EmailSendingScreenLoaderLayout({ screenLoaderText }) {
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
          src={emailSendingLoader}
          alt="loaderImage"
          style={{ height: "10.5rem" }}
        />
        <p>{screenLoaderText}</p>
      </div>
    </div>
  );
}
