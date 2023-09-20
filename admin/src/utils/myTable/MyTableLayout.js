import { Table, Pagination } from "antd";
import React, { useEffect, useState } from "react";

const MyTableLayout = ({
  columns,
  dataSource,
  pageSize,
  newlyOpen,
  totalPages,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    newlyOpen = false;
   
  };

  useEffect(() => {
    // Reset the page to 1 when newlyOpen prop changes
    if (newlyOpen) {
      setCurrentPage(1);
    }
  }, [newlyOpen]);

  // if(newlyOpen){
  //   setCurrentPage(1);
  // }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = dataSource.slice(startIndex, endIndex);


  return (
    <div style={{ flex: "1" }}>
      <div
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger={false}
          total={dataSource.length}
          // total={totalPages*pageSize}
          onChange={handlePageChange}
        />
      </div>
      <Table
        columns={columns}
        dataSource={currentData}
        pagination={false}
      // style={{ height: "690px" }}
      />
    </div>
  );
};

export default MyTableLayout;
