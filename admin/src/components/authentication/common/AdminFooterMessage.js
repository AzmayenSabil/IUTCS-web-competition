import React from "react";
import "../../../styles/AdminFooterMessageStyle.css";

export default function AdminFooterMessage({ messageText }) {
  return (
    <div className="client-footer-message" style={{ overflowY: "scroll" }}>
      {messageText}
    </div>
  );
}
