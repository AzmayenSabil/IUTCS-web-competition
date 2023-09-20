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
  Alert,
  Checkbox,
  Radio,
} from "antd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { DateRangePicker } from "rsuite";
import { DateRange } from "react-date-range";

import "./style.css";
import MyTable from "../../utils/myTable/MyTableLayout";

import axios from "axios";
import { debounce } from "lodash";
import HorizontalLine from "../../utils/HorizontalLine";
import warningIcon from "../../assets/warning.png";
// import DatePicker from "react-datepicker"; // Import the date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";

const { Search } = Input;
const { Option } = Select;

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const MenuListLayout = () => {
  const [genData, setGenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataForSearch, setFilteredDataForSearch] = useState([]);
  const [filteredDataForSearchedDate, setFilteredDataForSearchDate] = useState(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [queryByDate, setQueryByDate] = useState("");

  const [packageData, setPackageData] = useState([]);

  const [formModalOpen, setFormModalOpen] = useState(false);

  const [date, setDate] = useState(moment());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minDate, setMinDate] = useState(new Date());
  const [lunchEndTime, setLunchEndTime] = useState(null);
  const [disabledDatesArray, setDisabledDatesArray] = useState([]);
  // const [selectedCheckbox, setSelectedCheckbox] = useState('');

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [dateList, setDateList] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [selectedWorkingdays, setSelectedWorkingdays] = useState([]);
  const [selectedWeekends, setSelectedWeekends] = useState([]);

  const [mealType, setMealType] = useState("");
  const [packageName, setPackageName] = useState("");
  const [orderCount, setOrderCount] = useState();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [newlyOpen, setNewlyOpen] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedOrderRecord, setSelectedOrderRecord] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelRecord, setCancelRecord] = useState(null);
  const [menuDeletionConfirmationText, setMenuDeletionConfirmationText] =
    useState("");
  const [isMenuDeletionTextVisible, setMenuDeletionTextDisable] =
    useState(false);

  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const [showWarningModalBeforeAddingMenu, setWarningModalBeforeAddingMenu] =
    useState(false);
  const [totalMenus, setTotalMenus] = useState(0);
  const [totalMenusForSearch, setTotalMenusForSearch] = useState(0);
  const [showModalForInvalidDateInput, setModalForInvalidDateInput] =
    useState(false);
  const [showErrorText, setErrorText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageForSearch, setCurrentPageForSearch] = useState(1);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [menuBetweenTwoDate, setMenuBetweenTwoDate] = useState("");
  const [totalMenusBetweenTwoDate, setTotalMenusBetweenTwoDate] = useState(0);
  const [currentPageForSearchByDate, setCurrentPageForSearchByDate] =
    useState(1);
  const [showResetButtonForSearchByDate, setResetButtonForSearchByDate] =
    useState(false);
  const pageSizeForMainTable = 8;
  const pageSizeForDateTable = 8;

  const handleResetButtonForSearchByDate = () => {
    setFromDate("");
    setToDate("");
    setSearchQuery("");
    setQueryByDate("");
    setResetButtonForSearchByDate(false);
  };
  const base_url = process.env.REACT_APP_BASE_URL;

  const handleWarningModalBeforeAddingMenu = () => {
    setWarningModalBeforeAddingMenu(false);
  };

  const handleMenuDeletionText = (event) => {
    const text = event.target.value.trim();
    setMenuDeletionConfirmationText(text);

    if (text.toLowerCase() === "confirm") {
      setMenuDeletionTextDisable(true);
    } else {
      setMenuDeletionTextDisable(false);
    }
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
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleOrderCancel(record)}>
          Cancel
        </Button>
      ),
    },
  ];

  const [dataForOrderCount, setDataForOrderCount] = useState([]);

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
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ color: "green" }}
          >
            {/* <Tooltip title="Edit"> */}
            <Tooltip title="Edit Disabled">
              <EditIcon style={{ fontSize: "medium" }} />
            </Tooltip>
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(record)}
            style={{ color: "red" }}
          >
            <Tooltip title="Delete">
              <DeleteIcon style={{ fontSize: "medium" }} />
            </Tooltip>
          </Button>
        </>
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

  const weekdays = [
    { id: 0, name: "Sun" },
    { id: 1, name: "Mon" },
    { id: 2, name: "Tue" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thu" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" },
  ];

  const weekends = [
    { id: 0, name: "Sun" },
    { id: 6, name: "Sat" },
  ];

  const workingdays = [
    { id: 1, name: "Mon" },
    { id: 2, name: "Tue" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thu" },
    { id: 5, name: "Fri" },
  ];

  useEffect(() => {
    // Function to fetch lunch end time from the backend
    const fetchLunchEndTime = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(`${base_url}/api/v1/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data[1].value;

        const [timePart, meridian] = data.split(" ");
        const [hours, minutes] = timePart.split(":").map(Number); // Convert hh:mm:ss to hours and minutes

        // Create a new date with the current date and fetched lunch end time
        const lunchEndTime = new Date();
        lunchEndTime.setHours(hours);
        lunchEndTime.setMinutes(minutes);
        lunchEndTime.setSeconds(0);
        lunchEndTime.setMilliseconds(0);

        setLunchEndTime(lunchEndTime);

        // Update the disabled dates array based on the fetched lunch end time
        updateDisabledDatesArray(lunchEndTime);
      } catch (error) {
        setWarningModalBeforeAddingMenu(true);
      }
    };

    fetchLunchEndTime();
  }, []);

  const updateDisabledDatesArray = (endTime) => {
    const currentTime = new Date();
    const disabledDates = [];
    if (endTime && currentTime > endTime) {
      // If current time is greater than fetched lunch end time, add the current date to disabledDates
      const currentDate = new Date(currentTime);
      currentDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)
      disabledDates.push(currentDate);
    }
    setDisabledDatesArray(disabledDates);
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${base_url}/api/v1/admin/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const packagesResponse = response.data.data;
      setPackageData(packagesResponse);
      // console.log(packageData)

      const menuResponse = await axios.get(
        `${base_url}/api/v1/admin/menus?page=${currentPage}&pageSize=${pageSizeForMainTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const menuData = menuResponse.data.data;
      setTotalMenus(menuResponse.data.total_menus);

      const resolvedMenuData = menuData.map((item) => {
        const menuDate = moment(item.date);
        const formattedDate = menuDate.format("YYYY-MM-DD");
        const dayName = menuDate.format("dddd");

        return {
          key: item.menu_id,
          date: `${formattedDate}\n${dayName}`,
          mealType: item.meal_type,
          packageName: item.package_name,
          count: item.orders_count,
        };
      });

      resolvedMenuData.sort((a, b) => {
        const dateA = moment(a.date.split("\n")[0], "YYYY-MM-DD");
        const dateB = moment(b.date.split("\n")[0], "YYYY-MM-DD");

        if (dateA.isBefore(dateB)) {
          return -1;
        } else if (dateA.isAfter(dateB)) {
          return 1;
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

  //c
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
      fromDate < formattedCurrentDateForCheckingValidDateSearchedDate ||
      toDate < formattedCurrentDateForCheckingValidDateSearchedDate
    ) {
      setResetButtonForSearchByDate(false);
      setModalForInvalidDateInput(true);
      setErrorText(
        "Start and End date must be greater or equal to the Present Date"
      );
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      // console.log(fromDate, toDate);

      setQueryByDate("queried");
      // console.log("run");

      const menuResponseBetweenTwoDate = await axios.get(
        `${base_url}/api/v1/admin/menus/menu-between-date?page=${currentPageForSearchByDate}&pageSize=${pageSizeForDateTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { from: fromDate, to: toDate },
        }
      );

      // console.log(menuResponseBetweenTwoDate.data.total_menus);
      // console.log(menuResponseBetweenTwoDate.data.dataBetweenTwoDate);

      const menuDataBetweenTwoDate =
        menuResponseBetweenTwoDate.data.dataBetweenTwoDate;

      const resolvedMenuData = menuDataBetweenTwoDate.map((item) => {
        const menuDate = moment(item.date);
        const formattedDate = menuDate.format("YYYY-MM-DD");
        const dayName = menuDate.format("dddd");

        const ordersForMenu = item.ordersForMenuBetweenTwoDate.map((order) => {
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

      resolvedMenuData.sort((a, b) => {
        const dateA = moment(a.date.split("\n")[0], "YYYY-MM-DD");
        const dateB = moment(b.date.split("\n")[0], "YYYY-MM-DD");

        if (dateA.isBefore(dateB)) {
          return -1;
        } else if (dateA.isAfter(dateB)) {
          return 1;
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

      setTotalMenusBetweenTwoDate(menuResponseBetweenTwoDate.data.total_menus);
      setFilteredDataForSearchDate(resolvedMenuData);

      data = resolvedMenuData;
    } catch (error) {
      console.error(error);
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

  //c

  const hideModalForInvalidDateInput = () => {
    setModalForInvalidDateInput(false);
  };

  const getPackageIdByName = (packages, packageName) => {
    const packageFind = packages.find((item) => item.name === packageName);
    return packageFind ? packageFind.package_id : null;
  };

  const handleCountClick = async (record) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get(
        `${base_url}/api/v1/admin/menus/${record.key}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response.data.data);

      if (response.data.code === 200) {
        const ordersForMenu = response.data.data.map((order) => {
          // console.log(response.data.data[0].createdAt)
          const [formattedDate, dayName] = record.date.split("\n");
          const parts = order.createdAt.split("T");
          const datePart = parts[0];
          const timePart = parts[1].split(".")[0];

          const formattedCreatedAt = `${datePart} ${timePart}`;

          return {
            ...order,
            name: order.username,
            menu_id: order.menu_id,
            date: formattedDate,
            day: dayName,
            // createdAt: order.createdAt,
            createdAt: formattedCreatedAt,
            mealType: record.mealType,
            packageName: record.packageName,
            employeeId: order.employeeId,
          };
        });

        // Sort ordersForMenu based on employeeId in ascending order
        ordersForMenu.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

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

  const handleOrderModalVisibleCancel = () => {
    setOrderModalVisible(false);
    setNewlyOpen(true);
  };

  const handleOrderCancel = (record) => {
    // const currentDate = moment();
    // const recordDate = moment(record.date, "YYYY-MM-DD"); // Provide the correct format here
    const currentHour = moment().hour(); // Get the current hour (0-23)
    const cancelHour = 17; // 5 PM in 24-hour format

    if (cancelHour < currentHour) {
      // if (recordDate.isBefore(currentDate, "day")) {
      // Show a warning modal using Ant Design
      Modal.warning({
        title: "Cannot Delete Order",
        content: "This order cannot be deleted as its date has already passed.",
        centered: true,
      });
    } else {
      setCancelRecord(record);
      setCancelModalVisible(true);
    }
  };

  const handleCancelModalOk = async () => {
    try {
      const { user_id, menu_id } = cancelRecord;

      const token = sessionStorage.getItem("token");

      await axios.delete(
        `${base_url}/api/v1/admin/orders/${user_id}/menus/${menu_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let data = [...selectedOrderRecord.orderData];

      const updatedData = data.filter(
        (item) => item.user_id !== cancelRecord.user_id
      );

      selectedOrderRecord.count -= 1;
      selectedOrderRecord.orderData = [...updatedData];

      // Close the cancel modal or perform any necessary actions
      setCancelModalVisible(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      // Handle error state or display an error message
    }
  };

  const handleCancelModalCancel = () => {
    setCancelModalVisible(false);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);

    setDate(record.date);
    setMealType(record.mealType);
    setPackageName(record.packageName);
    setOrderCount(record.count);

    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      // Date validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (typeof date !== "string" || !date.match(dateRegex)) {
        Modal.error({
          title: "Invalid Date",
          content: "Date should be in YYYY-MM-DD format",
        });
        return;
      }

      const enteredDate = moment(date, "YYYY-MM-DD");
      const currentDate = moment();

      if (enteredDate <= currentDate) {
        Modal.error({
          title: "Invalid Date",
          content: "Date should be greater than the current date",
        });
        return;
      }

      if (enteredDate.day() === 6 || enteredDate.day() === 0) {
        Modal.error({
          title: "Invalid Date",
          content: "Weekend dates (Saturday and Sunday) are not allowed",
        });
        return;
      }

      const recordIndex = filteredData.findIndex(
        (record) => record.key === selectedRecord.key
      );

      if (recordIndex !== -1) {
        const updatedRecord = { ...selectedRecord };
        updatedRecord.date = date;
        updatedRecord.mealType = mealType;
        updatedRecord.packageName = packageName;
        updatedRecord.count = orderCount;

        const updatedData = [...filteredData];
        updatedData[recordIndex] = updatedRecord;

        setFilteredData(updatedData);

        const token = sessionStorage.getItem("token");
        const menuId = selectedRecord.key;

        // Fetch packages
        const packagesResponse = await axios.get(
          `${base_url}/api/v1/admin/packages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Access the packages data
        const packages = packagesResponse.data.data;

        const packageId = getPackageIdByName(
          packages,
          updatedRecord.packageName
        );

        const response = await axios.put(
          `${base_url}/api/v1/admin/menus/${menuId}`,
          {
            date: updatedRecord.date,
            package_id: packageId,
            meal_type: updatedRecord.mealType,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        //console.log(response.data);
        // console.log(response.data);
      }

      setDate("");
      setMealType("");
      setPackageName("");
      setOrderCount("");

      setEditModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalOk = async () => {
    try {
      const token = sessionStorage.getItem("token");
      // Send a DELETE request to delete the menu item
      await axios.delete(
        `${base_url}/api/v1/admin/menus/${selectedRecord.key}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove the deleted menu item from the filteredData state
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((data) => data.key !== selectedRecord.key)
      );

      setDeleteModalVisible(false);
      setMenuDeletionConfirmationText("");
      setMenuDeletionTextDisable(false);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
    setMenuDeletionConfirmationText("");
    setMenuDeletionTextDisable(false);
  };

  useEffect(() => {
    handleFetchMenus();
  }, [currentPageForSearch, searchQuery]);

  const handleFetchMenus = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get(`${base_url}/api/v1/admin/menu/search`, {
        params: {
          searchQuery,
          page: currentPageForSearch,
          pageSize: pageSizeForMainTable,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

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
            employeeId: order.employee_id,
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

      // Update the state with the processed data
      setFilteredDataForSearch(resolvedMenuData);
      setTotalMenusForSearch(response.data.total_menus);
    } catch (error) {
      // console.error("Error fetching menus:", error);
      if (error.response.status === 403) {
        Modal.error({
          title: "No Data",
          centered: true,
        });
        setSearchQuery("");
        return;
      }
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
  };

  // Function to handle the Ok button click
  const handleCancelClick = () => {
    // Clear the states when the modal is closed
    setDates([
      {
        startDate: minDate,
        endDate: minDate,
        key: "selection",
      },
    ]);
    setStartDate("");
    setEndDate("");
    setMealType("");
    setPackageName("");
    setSelectedWeekdays([]);
    setSelectedWorkingdays([]);
    setSelectedWeekends([]);
    setOrderCount("");
    setFormModalOpen(true);
    setOverwriteConfirmed(false);
  };

  // Function to handle the Overwrite button click
  const handleOverwriteClick = (response) => {
    // Show the confirmation modal
    Modal.confirm({
      title: "Confirm Overwrite",
      content:
        "This will overwrite the old menus with the new ones. Are you sure to proceed?",
      centered: true,
      onOk: async () => {
        const token = sessionStorage.getItem("token");
        // Close the modal
        setFormModalOpen(false);
        // Set overwriteConfirmed state to true, indicating user confirmation
        setOverwriteConfirmed(true);

        // Call the API to perform the overwrite
        try {
          const overwriteResponse = await axios.post(
            `${base_url}/api/v1/admin/menus/overwrite`,
            {
              duplicates: response.data.data.duplicateMenus,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // console.log(overwriteResponse.data.menus);
          // Handle the response and update the state if needed
          // For example, you can clear the filtered data and update it with the new data
          const updatedFilteredData = overwriteResponse.data.menus.map(
            (menuItem) => ({
              key: menuItem.menu_id,
              date: `${moment(menuItem.date).format("YYYY-MM-DD")}\n${moment(
                menuItem.date
              ).format("dddd")}`,
              mealType: menuItem.meal_type,
              packageName: menuItem.package_name,
              packageId: menuItem.package_id,
              count: 0,
            })
          );
          setFilteredData([...filteredData, ...updatedFilteredData]);

          // Clear other states if needed
          setStartDate("");
          setEndDate("");
          setDates([
            {
              startDate: minDate,
              endDate: minDate,
              key: "selection",
            },
          ]);
          setMealType("");
          setPackageName("");
          setSelectedWeekdays([]);
          setSelectedWorkingdays([]);
          setSelectedWeekends([]);
          setOrderCount("");
          setOverwriteConfirmed(false); // Reset the overwrite confirmation state
        } catch (error) {
          // Handle the error if the overwrite request fails
          console.error("Error overwriting menus:", error);
        }
      },
      onCancel: handleCancelClick, // Call handleCancelClick when Cancel button is clicked
    });
  };

  const handleFormSubmit = async () => {
    const mealTypeValues = ["Breakfast", "Lunch"];
    if (!mealTypeValues.includes(mealType)) {
      Modal.error({
        title: "Invalid Meal Type",
        content: 'Meal type should be either "Breakfast" or "Lunch"',
      });
      return;
    }
    const currentDate = moment().startOf("day");

    const enteredStartDate = moment(dates[0].startDate, "YYYY-MM-DD");
    const enteredEndDate = moment(dates[0].endDate, "YYYY-MM-DD");
    const calculatedCurrentDate = moment(currentDate, "YYYY-MM-DD");

    //console.log(enteredStartDate, calculatedCurrentDate)

    if (enteredEndDate.isBefore(enteredStartDate)) {
      Modal.error({
        title: "Invalid Date Range",
        content: "End date should be greater than or equal to the start date",
      });
      return;
    }

    if (enteredStartDate.isBefore(calculatedCurrentDate)) {
      Modal.error({
        title: "Invalid Start Date",
        content: "Start date should be greater than the current date",
      });
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      // const packagesResponse = await axios.get(
      //   `${base_url}/api/v1/admin/packages`,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );

      // const packageNameLowerCase = packageName.toLowerCase();
      // const packageFind = packagesResponse.data.data.find(
      //   (pkg) => pkg.name.toLowerCase() === packageNameLowerCase
      // );

      const packageNameLowerCase = packageName.toLowerCase();
      const packageFind = packageData.find(
        (pkg) => pkg.name.toLowerCase() === packageNameLowerCase
      );

      if (!packageFind) {
        Modal.error({
          title: "Invalid Package",
          content: "Package not found",
        });
        return;
      }

      const packageId = packageFind.package_id;

      const response = await axios.post(
        `${base_url}/api/v1/admin/menus`,
        {
          startDate: dates[0].startDate,
          endDate: dates[0].endDate,
          selectedWeekdays,
          package_id: packageId,
          meal_type: mealType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);

      // If there are duplicate menus, show them in a modal
      if (response.data.data.duplicateMenus) {
        Modal.confirm({
          title: "Invalid Request",
          content: (
            <div>
              <p>Menus with the same meal_type and date range already exist:</p>
              <ul>
                {response.data.data.duplicateMenus.map((menu) => (
                  <li key={`${menu.date}-${menu.meal_type}`}>
                    Date: {moment(menu.date).format("YYYY-MM-DD")}, Meal Type:{" "}
                    {menu.meal_type}
                  </li>
                ))}
              </ul>
            </div>
          ),
          centered: true,
          okText: "Overwrite",
          okType: "danger",
          cancelText: "Cancel",
          onOk: () => handleOverwriteClick(response),
          onCancel: handleCancelClick,
          okButtonProps: { disabled: overwriteConfirmed },
        });
      } else if (
        response.data.data.menus &&
        response.data.data.menus.length > 0
      ) {
        // console.log(response.data.data.menus)
        const updatedFilteredData = response.data.data.menus.map(
          (menuItem) => ({
            key: menuItem.menu_id,
            date: `${moment(menuItem.date).format("YYYY-MM-DD")}\n${moment(
              menuItem.date
            ).format("dddd")}`,
            mealType: mealType,
            packageName: packageName,
            count: 0,
          })
        );

        setFilteredData([...filteredData, ...updatedFilteredData]);

        setDates([
          {
            startDate: minDate,
            endDate: minDate,
            key: "selection",
          },
        ]);
        setStartDate("");
        setEndDate("");
        setMealType("");
        setPackageName("");
        setSelectedWeekdays([]);
        setSelectedWorkingdays([]);
        setSelectedWeekends([]);
        setOrderCount("");

        setFormModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleCancelForAdd = () => {
    setDates([
      {
        startDate: minDate,
        endDate: minDate,
        key: "selection",
      },
    ]);
    setMealType("");
    setPackageName("");
    setSelectedWeekdays([]);
    setFormModalOpen(false);
  };

  const handleDownloadPDF = (orderData) => {
    const sortedOrderData = orderData
      .slice()
      .sort((a, b) => a.employeeId - b.employeeId);

    const date = sortedOrderData[0].date;
    const day = sortedOrderData[0].day;
    const meal_type = selectedOrderRecord.mealType;
    const package_name = sortedOrderData[0].packageName;
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
                order.employeeId,
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

  useEffect(() => {}, [
    selectedWeekdays,
    selectedWeekends,
    selectedWorkingdays,
  ]);

  const handleSelectWeekends = () => {
    const selectedWeekendNames = weekends.map((weekend) => weekend.name);
    if (selectedWeekends.length === weekends.length) {
      setSelectedWeekends([]);
      setSelectedWeekdays((prevWeekdays) =>
        prevWeekdays.filter(
          (weekday) => !selectedWeekendNames.includes(weekday)
        )
      );
    } else {
      setSelectedWeekends(selectedWeekendNames);
      setSelectedWeekdays((prevWeekdays) =>
        Array.from(new Set([...prevWeekdays, ...selectedWeekendNames]))
      );
    }
  };

  const handleSelectWorkingdays = () => {
    const selectedWorkingdayNames = workingdays.map(
      (workingday) => workingday.name
    );

    if (selectedWorkingdays.length === workingdays.length) {
      setSelectedWorkingdays([]);
      setSelectedWeekdays((prevWeekdays) =>
        prevWeekdays.filter(
          (weekday) => !selectedWorkingdayNames.includes(weekday)
        )
      );
    } else {
      setSelectedWorkingdays(selectedWorkingdayNames);
      setSelectedWeekdays((prevWeekdays) =>
        Array.from(new Set([...prevWeekdays, ...selectedWorkingdayNames]))
      );
    }
  };

  const handleWeekdaySelection = (e) => {
    const selectedWeekday = e.target.value;
    if (e.target.checked) {
      setSelectedWeekdays((prevWeekdays) => [...prevWeekdays, selectedWeekday]);
    } else {
      setSelectedWeekdays((prevWeekdays) =>
        prevWeekdays.filter((weekday) => weekday !== selectedWeekday)
      );
    }
  };

  const handleSelectAllWeekdays = () => {
    if (selectedWeekdays.length === weekdays.length) {
      setSelectedWeekdays([]);
      setSelectedWeekends([]);
      setSelectedWorkingdays([]);
    } else {
      const allWeekdays = weekdays.map((weekday) => weekday.name);
      setSelectedWeekdays(allWeekdays);
      setSelectedWeekends(weekends);
      setSelectedWorkingdays(workingdays);
    }
  };

  useEffect(() => {
    const { startDate, endDate } = dates[0];
    const start = moment(startDate);
    const end = moment(endDate);
    setStartDate(start);
    setEndDate(end);

    const formattedDates = [];
    while (start <= end) {
      const formattedDate = start.format("YYYY-MM-DD");
      formattedDates.push(formattedDate);

      start.add(1, "day");
    }

    setDateList(formattedDates);
  }, [dates]);

  const handleDateRange = (item) => {
    setDates([item.selection]);
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
          padding: "0px", // Add padding for spacing and to create borders
          // border: "1px solid #ccc", // Add a light border
        }}
      >
        <div
          style={{
            flex: 1,
            marginRight: "20px",
            padding: "10px", // Add padding for spacing and to create borders
            // border: "1px solid #ccc", // Add a light border
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
      </div>
      {/* <br></br> */}
      {/* Right content */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "30px",
        }}
      >
        <Button
          type="primary"
          onClick={() => setFormModalOpen(true)}
          style={{
            backgroundColor: "rgb(0, 176, 240)",
            marginTop: "0px",
            // marginLeft: "640px"
          }}
        >
          Add Menu
        </Button>
      </div>

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
      <Modal
        title="Edit Record"
        //open={editModalVisible}
        open={false}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Submit"
        centered
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="date" style={{ marginBottom: "5px" }}>
            Date:
          </label>
          <Input
            type="date"
            id="datepicker"
            value={date ? moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") : ""}
            onChange={(event) =>
              setDate(
                event.target.value
                  ? moment(event.target.value).format("YYYY-MM-DD")
                  : ""
              )
            }
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Select
            id="mealType"
            placeholder={selectedRecord ? selectedRecord.mealType : ""}
            value={mealType}
            onChange={(value) => setMealType(value)}
            style={{ width: "100%" }}
          >
            <Select.Option value="Breakfast">Breakfast</Select.Option>
            <Select.Option value="Lunch">Lunch</Select.Option>
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="packageName" style={{ marginBottom: "5px" }}>
            Package Name:
          </label>
          <Select
            id="packageName"
            placeholder="Select package name"
            value={packageName}
            onChange={(value) => setPackageName(value)}
            style={{ width: "100%" }} // Example styling for the Select component
            dropdownStyle={{ width: "100%" }} // Example styling for the dropdown menu
          >
            {packageData.map((packageItem) => (
              <Select.Option key={packageItem.id} value={packageItem.name}>
                {packageItem.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="orderCount" style={{ marginBottom: "5px" }}>
            Order Count:
          </label>
          <Input
            id="orderCount"
            placeholder={selectedRecord ? selectedRecord.count : ""}
            value={orderCount}
            onChange={(e) => setOrderCount(e.target.value)}
            disabled
          />
        </div>
      </Modal>

      <Modal
        title="Delete Record"
        open={deleteModalVisible}
        centered
        onCancel={handleDeleteModalCancel}
        footer={null}
        style={{ height: "fit-content", maxHeight: "80vh" }}
        width="35%"
      >
        <p>Are you sure you want to delete this menu?</p>

        <Alert
          message="Warning: Deleting this menu will result in the removal of related orders."
          type="warning"
          showIcon
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "16px",
          }}
        >
          <label
            style={{
              color: "rgb(255, 77, 79)",
              marginBottom: "16px",
              fontStyle: "italic",
            }}
          >
            To delete this menu, please type{" "}
            <span style={{ color: "rgb(255, 77, 79)", fontWeight: "bold" }}>
              confirm
            </span>
          </label>
          <Input
            style={{ flex: "1", width: "255px" }}
            type="text"
            value={menuDeletionConfirmationText}
            onChange={handleMenuDeletionText}
            autoFocus
          />
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {isMenuDeletionTextVisible && (
              <Button
                style={{
                  background: "rgb(255, 77, 79)",
                  color: "white",
                  border: "none",
                  marginRight: "8px",
                }}
                onClick={handleDeleteModalOk}
              >
                Proceed
              </Button>
            )}
            <Button onClick={handleDeleteModalCancel}>Cancel</Button>
          </div>
        </div>
      </Modal>
      <Modal
        title={
          <>
            <div
              style={{
                textAlign: "center",
                fontSize: "25px",
                fontWeight: "normal",
                marginBottom: "20px",
                color: "#00B0F0",
              }}
            >
              Portal
            </div>
            <div style={{ textAlign: "center", fontSize: "14px" }}>
              Please give information to add a package
            </div>
          </>
        }
        centered
        open={formModalOpen}
        onOk={handleFormSubmit}
        onCancel={() => handleCancelForAdd()}
        okText="Add"
      >
        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <label
            htmlFor="date"
            style={{ marginBottom: "5px", marginRight: "10px" }}
          >
            Select Date Range:
          </label>
          <div
            id="date-range-picker"
            style={{
              margin: "auto",

              padding: "10px 56px 0 57px",
            }}
          >
            {isOpen && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => handleDateRange(item)}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                minDate={minDate}
              />
            )}
          </div>
        </div>

        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <label style={{ marginBottom: "10px" }}>Select specific days:</label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                marginRight: "10px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedWeekdays.length === weekdays.length}
                onChange={handleSelectAllWeekdays}
                style={{ marginRight: "5px" }}
              />
              <label htmlFor="selectAll">All &nbsp; </label>
              <p>
                <HorizontalLine />
              </p>
            </div>
            <div
              style={{
                marginRight: "10px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id="selectWorkingDay"
                checked={selectedWorkingdays.length === workingdays.length}
                onChange={handleSelectWorkingdays}
                style={{ marginRight: "5px" }}
              />
              <label htmlFor="selectWorkingDay">Working days &nbsp; </label>
              <p>
                <HorizontalLine />
              </p>
            </div>
            <div
              style={{
                marginRight: "10px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id="selectWeekend"
                checked={selectedWeekends.length === weekends.length}
                onChange={handleSelectWeekends}
                style={{ marginRight: "5px" }}
              />
              <label htmlFor="selectWeekend">Weekends &nbsp; </label>
              <p>
                <HorizontalLine />
              </p>
            </div>
            <div>
              {weekdays.map((weekday) => (
                <div
                  key={weekday.id}
                  style={{
                    marginRight: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    id={weekday.name}
                    value={weekday.name}
                    checked={selectedWeekdays.includes(weekday.name)}
                    onChange={handleWeekdaySelection}
                    style={{ marginRight: "5px" }}
                  />
                  <label htmlFor={weekday.name}>{weekday.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label htmlFor="mealType" style={{ marginBottom: "5px" }}>
            Meal-type:
          </label>
          <Select
            id="mealType"
            placeholder="Select meal type"
            value={mealType}
            onChange={(value) => setMealType(value)}
          >
            <Option value="Breakfast">Breakfast</Option>
            <Option value="Lunch">Lunch</Option>
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="packageName" style={{ marginBottom: "5px" }}>
            Package Name:
          </label>
          <Select
            id="packageName"
            placeholder="Select package name"
            value={packageName}
            onChange={(value) => setPackageName(value)}
            style={{ width: "100%" }} // Example styling for the Select component
            dropdownStyle={{ width: "100%" }} // Example styling for the dropdown menu
          >
            {packageData.map((packageItem) => (
              <Option key={packageItem.id} value={packageItem.name}>
                {packageItem.name} - {packageItem.vendor}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>

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
        onCancel={() => handleOrderModalVisibleCancel()}
        footer={null}
        centered
        width={"900px"}
        // bodyStyle={{ maxHeight: "900px", overflow: "auto" }} // Adjusted max height
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
            newlyOpen={new Date().getTime()}
          
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

      <Modal
        title="Cancel Order"
        open={cancelModalVisible}
        onOk={handleCancelModalOk}
        onCancel={handleCancelModalCancel}
        okText="Yes"
        cancelText="No"
        centered
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
      <Modal
        title={
          <span>
            <img
              src={warningIcon}
              alt="warningIcon"
              width="28px"
              height="28px"
            />{" "}
            &nbsp;Warning
          </span>
        }
        open={showWarningModalBeforeAddingMenu}
        style={{ display: "grid" }}
        onCancel={handleWarningModalBeforeAddingMenu}
        footer={[
          <Button
            key="ok"
            type="primary"
            style={{ backgroundColor: "rgb(0,176,224)" }}
            onClick={handleWarningModalBeforeAddingMenu}
          >
            OK
          </Button>,
        ]}
      >
        <p>
          Configure all your settings first on Settings Page before adding any
          Menu! Otherwise you cannot add any Menu.
        </p>
      </Modal>

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

export default MenuListLayout;
