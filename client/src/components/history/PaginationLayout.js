import { Pagination } from "antd";
import React from "react";
export default function PaginationLayout({
  pageSize,
  total,
  currentPage,
  onChange,
}) {
  return (
    <Pagination
      pageSize={pageSize}
      total={total}
      current={currentPage}
      onChange={onChange}
      style={{
        position: "sticky",
        top: "20px",
        right: "20px",
        float: "right",
      }}
    />
  );
}
