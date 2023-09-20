import React from "react";
import ClientNavbarLayout from "../../components/navbar/ClientNavbarLayout";
import ClientHistoryLayout from "../../components/history/ClientHistoryLayout";
import TabTitle from "../../utils/TabTitle";

export default function ClientHistoryPage() {
  TabTitle("Portal - Order History");
  return (
    <>
      <ClientNavbarLayout />
      <ClientHistoryLayout />
    </>
  );
}
