import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  Input,
  Table,
  Modal,
  Tooltip,
  Select,
  Pagination,
  Radio,
  Alert,
} from "antd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import axios from "axios";
import { debounce } from "lodash";
import MyTable from "../../utils/myTable/MyTableLayout";

const { Search } = Input;

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PastMenuListLayout = () => {
  const [genData, setGenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataForSearch, setFilteredDataForSearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDataForSearchedDate, setFilteredDataForSearchDate] = useState(
    []
  );
  const [queryByDate, setQueryByDate] = useState("");
  const [packageData, setPackageData] = useState([]);

  const [formModalOpen, setFormModalOpen] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedOrderRecord, setSelectedOrderRecord] = useState(null);

  const [totalMenus, setTotalMenus] = useState(0);
  const [totalMenusForSearch, setTotalMenusForSearch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageForSearch, setCurrentPageForSearch] = useState(1);
  const [totalMenusBetweenTwoDate, setTotalMenusBetweenTwoDate] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPageForSearchByDate, setCurrentPageForSearchByDate] =
    useState(1);
  const pageSizeForMainTable = 8;
  const pageSizeForDateTable = 8;
  const [dataForOrderCount, setDataForOrderCount] = useState([]);
  const [showResetButtonForSearchByDate, setResetButtonForSearchByDate] =
    useState(false);
  const [showModalForInvalidDateInput, setModalForInvalidDateInput] =
    useState(false);
  const [showErrorText, setErrorText] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;

  const handleResetButtonForSearchByDate = () => {
    setFromDate("");
    setToDate("");
    setSearchQuery("");
    setQueryByDate("");
    setResetButtonForSearchByDate(false);
  };
  const hideModalForInvalidDateInput = () => {
    setModalForInvalidDateInput(false);
  };

  const listOfOrdersColumns = [
    {
      title: "ID",
      dataIndex: "employeeId",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Order Time",
      dataIndex: "createdAt",
    },
    {
      title: "Date",
      dataIndex: "date",
      className: "hidden-column",
      render: (_, record) => null, // Render nothing to hide the column
    },
    {
      title: "Day",
      dataIndex: "day",
      className: "hidden-column",
      render: (_, record) => null, // Render nothing to hide the column
    },
    {
      title: "Meal Type",
      dataIndex: "mealType",
      className: "hidden-column",
      render: (_, record) => null, // Render nothing to hide the column
    },

    {
      title: "Package Name",
      dataIndex: "packageName",
      className: "hidden-column",
      render: (_, record) => null,
    },
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => (
        <div style={{ whiteSpace: "pre-line" }}>{text}</div> // Use whiteSpace: 'pre-line' to preserve line breaks
      ),
    },
    {
      title: "Meal Type",
      dataIndex: "mealType",
    },
    {
      title: "Package Name",
      dataIndex: "packageName",
    },
    {
      title: "Count",
      dataIndex: "count",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleCountClick(record)}
          style={{
            border: "1px solid #00B0F0",
            borderRadius: "20%",
            backgroundColor: "white",
            display: "inline-block",
            padding: "4px 6px",
          }}
        >
          {record.count}
        </Button>
      ),
    },
    {
      // Hidden column to hold orderDataForOrderCount
      title: "Order Data",
      dataIndex: "orderData",
      className: "hidden-column",
      render: (_, record) => null, // Render nothing to hide the column
    },
  ];

  let data = [];

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${base_url}/api/v1/admin/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const packagesResponse = response.data.data;
      setPackageData(packagesResponse);

      const menuResponse = await axios.get(
        `${base_url}/api/v1/admin/pastmenus?page=${currentPage}&pageSize=${pageSizeForMainTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // findMinMaxDateOfMenu(menuResponse);

      const menuData = menuResponse.data.data;
      //console.log(menuData)
      setTotalMenus(menuResponse.data.total_menus);

      const resolvedMenuData = menuData.map((item) => {
        const menuDate = moment(item.date);
        const formattedDate = menuDate.format("YYYY-MM-DD");
        const dayName = menuDate.format("dddd");

        // const ordersForMenu = item.orders.map((order) => {
        //   return {
        //     ...order,
        //     name: order.username,
        //     date: `${formattedDate}`,
        //     day: `${dayName}`,
        //     mealType: item.meal_type,
        //     packageName: item.package_name,
        //     menu_id: item.menu_id,
        //     employee_id: order.employee_id,
        //   };
        // });

        // console.log(ordersForMenu)

        return {
          key: item.menu_id,
          date: `${formattedDate}\n${dayName}`,
          mealType: item.meal_type,
          packageName: item.package_name,
          count: item.orders_count,
          // orderData: ordersForMenu,
        };
      });

      resolvedMenuData.sort((a, b) => {
        const dateA = moment(a.date.split("\n")[0], "YYYY-MM-DD");
        const dateB = moment(b.date.split("\n")[0], "YYYY-MM-DD");

        if (dateA.isBefore(dateB)) {
          return 1;
        } else if (dateA.isAfter(dateB)) {
          return -1;
        } else {
          const mealOrder = {
            Breakfast: 1,
            Lunch: 2,
          };
          const mealTypeComparison =
            mealOrder[a.mealType] - mealOrder[b.mealType];

          if (mealTypeComparison === 0) {
            return a.count - b.count;
          }

          return mealTypeComparison;
        }
      });

      setFilteredData(resolvedMenuData);
      setGenData(resolvedMenuData);
      setSearchQuery("");
      setQueryByDate("");
      data = resolvedMenuData;
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const debouncedFetchData = debounce(fetchData, 300); // Debounce the fetchData function

  useEffect(() => {
    debouncedFetchData(); // Call the debounced fetchData function

    return () => {
      debouncedFetchData.cancel(); // Cancel the debounced fetchData function on component unmount
    };
  }, [formModalOpen, deleteModalVisible, currentPage]);

  const handleMenuBetweenTwoDate = async () => {
    setResetButtonForSearchByDate(true);
    const currentDateForCheckingValidDateSearchedDate = new Date();

    const year = currentDateForCheckingValidDateSearchedDate.getFullYear();
    const month = String(
      currentDateForCheckingValidDateSearchedDate.getMonth() + 1
    ).padStart(2, "0"); // Months are 0-based
    const day = String(
      currentDateForCheckingValidDateSearchedDate.getDate()
    ).padStart(2, "0");

    // Format the date
    const formattedCurrentDateForCheckingValidDateSearchedDate = `${year}-${month}-${day}`;

    // console.log(formattedCurrentDateForCheckingValidDateSearchedDate);
    // console.log("running");

    if (!fromDate || !toDate) {
      setResetButtonForSearchByDate(false);
      setModalForInvalidDateInput(true);
      setErrorText("You must provide Start and End date");
      return;
    }

    if (fromDate > toDate) {
      setResetButtonForSearchByDate(false);
      setModalForInvalidDateInput(true);
      setErrorText("Start date must be smaller than the End date");
      return;
    }
    if (
      fromDate >= formattedCurrentDateForCheckingValidDateSearchedDate ||
      toDate >= formattedCurrentDateForCheckingValidDateSearchedDate
    ) {
      setResetButtonForSearchByDate(false);
      setModalForInvalidDateInput(true);
      setErrorText("Start and End date must be less than the Present Date");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      // console.log(fromDate, toDate);

      setQueryByDate("queried");
      // console.log("run");

      const menuResponseBetweenTwoDate = await axios.get(
        `${base_url}/api/v1/admin/pastmenus/past-menu-between-two-date?page=${currentPageForSearchByDate}&pageSize=${pageSizeForDateTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { from: fromDate, to: toDate },
        }
      );

      // findMinMaxDateOfMenu(menuResponse);
      // console.log(menuResponseBetweenTwoDate.data.total_menus);
      // console.log(menuResponseBetweenTwoDate.data.pastDataBetweenTwoDate);

      const menuDataBetweenTwoDate =
        menuResponseBetweenTwoDate.data.pastDataBetweenTwoDate;
      //console.log(menuData)
      setTotalMenusBetweenTwoDate(menuResponseBetweenTwoDate.data.total_menus);

      const resolvedMenuData = menuDataBetweenTwoDate.map((item) => {
        const menuDate = moment(item.date);
        const formattedDate = menuDate.format("YYYY-MM-DD");
        const dayName = menuDate.format("dddd");

        const ordersForMenu = item.ordersForPastMenuBetweenTwoDate.map(
          (order) => {
            return {
              ...order,
              name: order.username,
              date: `${formattedDate}`,
              day: `${dayName}`,
              mealType: item.meal_type,
              packageName: item.package_name,
              menu_id: item.menu_id,
              employee_id: order.employee_id,
            };
          }
        );

        // console.log(ordersForMenu)

        return {
          key: item.menu_id,
          date: `${formattedDate}\n${dayName}`,
          mealType: item.meal_type,
          packageName: item.package_name,
          count: ordersForMenu.length,
          orderData: ordersForMenu,
        };
      });

      resolvedMenuData.sort((a, b) => {
        const dateA = moment(a.date.split("\n")[0], "YYYY-MM-DD");
        const dateB = moment(b.date.split("\n")[0], "YYYY-MM-DD");

        if (dateA.isBefore(dateB)) {
          return 1;
        } else if (dateA.isAfter(dateB)) {
          return -1;
        } else {
          const mealOrder = {
            Breakfast: 1,
            Lunch: 2,
          };
          const mealTypeComparison =
            mealOrder[a.mealType] - mealOrder[b.mealType];

          if (mealTypeComparison === 0) {
            return a.count - b.count;
          }

          return mealTypeComparison;
        }
      });

      setFilteredDataForSearchDate(resolvedMenuData);
      setGenData(resolvedMenuData);
      data = resolvedMenuData;
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };
  const debouncedFetchMenuDataBetweenTwoDate = debounce(
    handleMenuBetweenTwoDate,
    300
  );

  useEffect(() => {
    if (queryByDate === "queried") {
      debouncedFetchMenuDataBetweenTwoDate();
    }

    return () => {
      debouncedFetchMenuDataBetweenTwoDate.cancel();
    };
  }, [currentPageForSearchByDate]);

  // const handleCountClick = (record) => {
  //   if (record.count === 0) {
  //     setOrderModalVisible(false);
  //   } else {
  //     setOrderModalVisible(true);
  //   }

  //   setSelectedOrderRecord(record);
  //   //setOrderModalVisible(true);
  // };

  const handleCountClick = async (record) => {
    const token = sessionStorage.getItem("token");

    // console.log(record);
    try {
      const response = await axios.get(
        `${base_url}/api/v1/admin/pastmenus/${record.key}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === 200) {
        const ordersForMenu = response.data.data.map((order) => {
          const [formattedDate, dayName] = record.date.split("\n");
          // console.log(formattedDate, dayName);
          return {
            ...order,
            name: order.username,
            date: formattedDate,
            day: dayName,
            createdAt: moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            mealType: record.mealType,
            packageName: record.packageName,
            employeeId: order.employee_id,
          };
        });
        // Sort ordersForMenu based on employeeId in ascending order
        ordersForMenu.sort((a, b) => a.employeeId - b.employeeId);
        // console.log(ordersForMenu)
        record.orderData = ordersForMenu;

        if (ordersForMenu.length === 0) {
          setOrderModalVisible(false);
        } else {
          setOrderModalVisible(true);
        }

        setSelectedOrderRecord(record);
      } else {
        // Handle the error case
        console.error("Error fetching orders:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle the error case
    }
  };

  useEffect(() => {
    handleFetchMenus();
  }, [currentPageForSearch, searchQuery]);

  const handleFetchMenus = async () => {
    const token = sessionStorage.getItem("token");
    //console.log(searchQuery);
    try {
      const response = await axios.get(
        `${base_url}/api/v1/admin/menu/search/pastMenus`,
        {
          params: {
            searchQuery,
            page: currentPageForSearch,
            pageSize: pageSizeForMainTable,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log(response);

      // Process the response data and transform it into resolvedMenuData format
      const resolvedMenuData = response.data.data.map((item) => {
        const menuDate = moment(item.date);
        const formattedDate = menuDate.format("YYYY-MM-DD");
        const dayName = menuDate.format("dddd");

        const ordersForMenu = item.orders.map((order) => {
          return {
            ...order,
            name: order.username,
            date: `${formattedDate}`,
            day: `${dayName}`,
            mealType: item.meal_type,
            packageName: item.package_name,
            menu_id: item.menu_id,
            employee_id: order.employee_id,
          };
        });

        return {
          key: item.menu_id,
          date: `${formattedDate}\n${dayName}`,
          mealType: item.meal_type,
          packageName: item.package_name,
          count: ordersForMenu.length,
          orderData: ordersForMenu,
        };
      });

      // setFilteredData(resolvedMenuData); // Update the state with the processed data
      setFilteredDataForSearch(resolvedMenuData);
      // setTotalMenus(response.data.total_menus);
      setTotalMenusForSearch(response.data.total_menus);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const handleSearch = (event) => {
    const value = event;
    if (value === "") {
      setSearchQuery("");
      return;
    }
    setSearchQuery(value);
  };

  const onClick = (value) => {
    handleSearch(value);
    // console.log(value);
    // }
  };

  const handleDownloadPDF = (orderData) => {
    //console.log(orderData);

    const sortedOrderData = orderData
      .slice()
      .sort((a, b) => a.employee_id - b.employee_id);

    // console.log(sortedOrderData)
    const date = orderData[0].date;
    const day = orderData[0].day;
    const meal_type = orderData[0].mealType;
    const package_name = orderData[0].packageName;
    const count = sortedOrderData.length;

    const docDefinition = {
      content: [
        {
          text: `Date: ${date}\n\nDay: ${day}\n\nMeal Type: ${meal_type}\n\nPackage Name: ${package_name}\n\nOrder Count: ${count}\n\n\n\n`,
          style: "header",
        },
        {
          table: {
            widths: [30, 60, 220, 80],
            body: [
              ["SL", "ID", "Name", "Signature"],
              ...sortedOrderData.map((order, index) => [
                index + 1,
                order.employee_id,
                order.name,
                "",
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: false,
          margin: [0, 0, 0, 10],
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download("orders.pdf");
  };

  return (
    <div
      style={{
        margin: "15px 10px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "10px", // Add padding for spacing and to create borders
          // border: "1px solid #ccc", // Add a light border
        }}
      >
        <div
          style={{
            flex: 1,
            marginRight: "20px",
            padding: "10px", // Add padding for spacing and to create borders
            // border: "1px solid #ccc", // Add a light border
            // width: "40%",
          }}
        >
          <Search
            placeholder="Search date, meal type or package name"
            onSearch={handleSearch}
            style={{ width: "80%" }}
            allowClear
          />
        </div>

        <Radio.Group
          defaultValue={""}
          style={{
            padding: "4px", // Add padding for spacing and to create borders
            border: "1px solid #ccc", // Add a light border
            borderRadius: "7px",
            // width: "20%",
            alignItems: "center",
          }}
        >
          <Radio value="" onClick={() => onClick("")} defaultChecked={true}>
            All
          </Radio>
          <Radio value="Breakfast" onClick={() => onClick("Breakfast")}>
            Breakfast
          </Radio>
          <Radio value="Lunch" onClick={() => onClick("Lunch")}>
            Lunch
          </Radio>
        </Radio.Group>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "20px",
            // padding: "10px", // Add padding for spacing and to create borders
            // border: "1px solid #ccc", // Add a light border
            // borderRadius: "7px",
          }}
        >
          <span>From:&nbsp;</span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ cursor: "pointer", width: "30%" }}
          />

          <span>&nbsp;&nbsp;To:&nbsp;</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ cursor: "pointer", width: "30%" }}
          />
          <Button
            type="primary"
            onClick={() => handleMenuBetweenTwoDate(fromDate, toDate)}
            style={{
              backgroundColor: "rgb(0, 176, 240)",
              marginLeft: "10px",
              color: "white",
            }}
          >
            Search by Date
          </Button>
          {showResetButtonForSearchByDate && (
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              danger
              onClick={handleResetButtonForSearchByDate}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1, marginRight: "120px" }}>
          <Search
            placeholder="Search date, meal type or package name"
            onSearch={handleSearch}
            style={{ width: "300px", marginRight: "20px" }}
            allowClear
          />
        </div>

        <Radio.Group defaultValue={""}>
          <Radio
            value=""
            onClick={() => onClick("")}
            // onDoubleClick={onDoubleClick}
            defaultChecked={true}
          >
            All
          </Radio>
          <Radio
            value="Breakfast"
            onClick={() => onClick("Breakfast")}
            // onDoubleClick={onDoubleClick}
          >
            Breakfast
          </Radio>
          <Radio
            value="Lunch"
            onClick={() => onClick("Lunch")}
            // onDoubleClick={onDoubleClick}
          >
            Lunch
          </Radio>
        </Radio.Group>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginRight: "0px",
          }}
        >
          <span>From:&nbsp;</span>

          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ cursor: "pointer" }}
          />

          <span>&nbsp;&nbsp;To:&nbsp;</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ cursor: "pointer" }}
          />
          <Button
            type="primary"
            onClick={() => handleMenuBetweenTwoDate(fromDate, toDate)}
            style={{
              backgroundColor: "rgb(0, 176, 240)",
              marginLeft: "10px",
              color: "white",
            }}
          >
            Search by Date
          </Button>
          {showResetButtonForSearchByDate && (
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              danger
              onClick={handleResetButtonForSearchByDate}
            >
              Reset
            </Button>
          )}
        </div>
      </div> */}
      <Modal
        title={
          <div>
            <div>Orders</div>
            <hr />
            {selectedOrderRecord && (
              <div style={{ fontSize: "15px", color: "gray" }}>
                {`Package : ${selectedOrderRecord.orderData[0]?.packageName}`}
                <br></br>
                {`${selectedOrderRecord.orderData[0]?.date} (${selectedOrderRecord.orderData[0]?.day}) : ${selectedOrderRecord.mealType}  `}
              </div>
            )}
          </div>
        }
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        centered
        width={"900px"}
        // bodyStyle={{ maxHeight: "350px", minHeight: "350px", overflow: "auto" }}
      >
        <div
          style={{ maxHeight: "900px", minHeight: "350px", overflow: "auto" }}
        >
          <MyTable
            columns={listOfOrdersColumns}
            dataSource={
              selectedOrderRecord == null
                ? dataForOrderCount
                : selectedOrderRecord.orderData
            }
            pageSize={5}
          />
        </div>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {" "}
          {/* Added margin to create space */}
          <Button
            type="primary"
            onClick={() => handleDownloadPDF(selectedOrderRecord?.orderData)}
          >
            Download as PDF
          </Button>
        </div>
      </Modal>
      <>
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <ExclamationCircleOutlined
                style={{ marginRight: "10px", color: "red" }}
              />
              Warning
            </div>
          }
          open={showModalForInvalidDateInput}
          onOk={hideModalForInvalidDateInput}
          cancelButtonProps={{
            style: {
              display: "none",
            },
          }}
          okText="OK"
          closeIcon={false}
        >
          <p>{showErrorText}</p>
        </Modal>
      </>
      <div style={{ flex: "1" }}>
        <div
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {queryByDate === "queried" ? (
            <Pagination
              current={currentPageForSearchByDate}
              pageSize={pageSizeForDateTable}
              total={totalMenusBetweenTwoDate}
              showSizeChanger={false}
              onChange={(page) => setCurrentPageForSearchByDate(page)}
            />
          ) : searchQuery.length > 0 ? (
            <Pagination
              current={currentPageForSearch}
              pageSize={pageSizeForMainTable}
              total={totalMenusForSearch}
              showSizeChanger={false}
              onChange={(page) => setCurrentPageForSearch(page)}
            />
          ) : (
            <Pagination
              current={currentPage}
              pageSize={pageSizeForMainTable}
              showSizeChanger={false}
              total={totalMenus}
              onChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        <Table
          columns={columns}
          dataSource={
            queryByDate === "queried"
              ? filteredDataForSearchedDate
              : searchQuery.length > 0
              ? filteredDataForSearch
              : filteredData
          }
          pagination={false}
        />
      </div>
    </div>
  );
};

export default PastMenuListLayout;
