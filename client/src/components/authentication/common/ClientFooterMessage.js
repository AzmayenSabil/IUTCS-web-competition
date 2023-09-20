import React from "react";
import "../../../styles/ClientFooterMessageStyle.css";

export default function ClientFooterMessage({ messageText }) {
  return (
    <div className="client-footer-message" style={{ overflowY: "scroll" }}>
      {messageText}
    </div>
  );
}
