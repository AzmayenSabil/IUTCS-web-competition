import React from "react";
import "../../../styles/RegisterFooterMessageStyle.css";

export default function RegisterFooterMessage({ messageText }) {
  return (
    <div
      className="register-footer-box"
      style={{
        backgroundColor: "#f1f1f1",
        padding: "5px",
        marginTop: "4rem",
        width: "100%",
        animation: "slide-up 0.5s ease-out",
      }}
    >
      <style>
        {`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
   
        `}
      </style>
      <footer className="py-3 my-4">
        <p className="text-center">{messageText}</p>
      </footer>
    </div>
  );
}
