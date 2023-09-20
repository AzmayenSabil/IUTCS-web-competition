import React, { useEffect, useState } from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import moment from "moment";

import {
  InfoCircleTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  Button,
  Input,
  Table,
  Modal,
  Spin,
  Form,
  DatePicker,
  Progress,
  Select,
} from "antd";
import { notification } from "antd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeySharpIcon from "@mui/icons-material/KeySharp";
import HistoryIcon from "@mui/icons-material/History";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import MyTable from "../../utils/myTable/MyTableLayout";
import OrderHistoryTable from "../userList/OrderHistoryLayout";
import warningIcon from "../../assets/warning.png";

import { debounce } from "lodash";
var CryptoJS = require("crypto-js");

const { Search } = Input;
const { Option } = Select;

const UserListLayout = () => {
  const [genData, setGenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [orderHistoryRecord, setOrderHistoryRecord] = useState();

  const [editInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [loading, setLoading] = useState();

  const [orderHistoryModalOpen, setOrderHistoryModalOpen] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState([]);

  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [showWarningModal, setWarningModal] = useState(false);

  const base_url = process.env.REACT_APP_BASE_URL;
  const secret_key = process.env.REACT_APP_MY_SECRET_KEY;
  // console.log(secret_key)

  const handleWarningModal = () => {
    setWarningModal(false);
  };

  const [completeProfileModalOpen, setCompleteProfileModalOpen] =
    useState(false); // State for controlling the profile modal
  // const [selectedProfile, setSelectedProfile] = useState(null); // State to hold the selected profile data
  const [type, setType] = useState("");
  const [designation, setDesignation] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [endOfContract, setEndOfContract] = useState(null);
  const [releaseDate, setReleaseDate] = useState(null);
  const [grossSalary, setGrossSalary] = useState("");
  const [department, setDepartment] = useState("");
  const [gAccount, setGAccount] = useState("");
  const [joiningDate, setJoiningDate] = useState(null);
  const [profileProgress, setProfileProgress] = useState(null);

  const orderHistoryColumn = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Meal Type",
      dataIndex: "mealType",
    },
    {
      title: "Menu",
      dataIndex: "menu",
    },
  ];

  const pendingUserColumn = [
    {
      title: "ID",
      dataIndex: "employee_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            style={{ color: "green" }}
            onClick={() => handleAccept(record)}
          >
            <Tooltip title="Accept">
              <DoneIcon style={{ fontSize: "x-large" }} />
            </Tooltip>
          </Button>
          <Button
            type="link"
            style={{ color: "red" }}
            onClick={() => handleReject(record)}
          >
            <Tooltip title="Reject">
              <CloseIcon style={{ fontSize: "x-large" }} />
            </Tooltip>
          </Button>
        </>
      ),
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "employee_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => handleView(record)}
            style={{ color: "green" }}
          >
            <Tooltip title="View">
              <VisibilityIcon style={{ fontSize: "large" }} />
            </Tooltip>
          </Button>
          <Button
            type="link"
            onClick={() => handleChangePassword(record)}
            style={{ color: "black" }}
          >
            <Tooltip title="Change Password">
              <KeySharpIcon style={{ fontSize: "x-large" }} />
            </Tooltip>
          </Button>
          <Button
            type="link"
            onClick={() => handleViewHistory(record)}
            style={{ color: "blue" }}
          >
            <Tooltip title="View Order History">
              <HistoryIcon style={{ fontSize: "x-large" }} />
            </Tooltip>
          </Button>
        </>
      ),
    },
    {
      title: "Profile Completion",
      dataIndex: "profile_completion",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleCompleteProfile(record)}
          style={{ color: "purple" }} // Adjust the color as needed
        >
          <Tooltip title="Profile completion">
            <AccountBoxIcon style={{ fontSize: "large" }} />{" "}
            {/* Replace with the actual profile icon component */}
          </Tooltip>
        </Button>
      ),
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (_, record) => (
        <>
          <Switch
            checked={
              record && (record.active === "yes" || record.active === undefined)
            }
            onClick={() => handleActive(record)}
            inputProps={{ "aria-label": "controlled" }}
          />

          {record && record.active === "yes" ? (
            <span>On</span>
          ) : (
            <span>Off</span>
          )}
        </>
      ),
    },
  ];

  let data = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(`${base_url}/api/v1/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // const response = await axios.get("http://localhost:8000/api/v1/users", {
        //   headers: { Authorization: `Bearer ${token}` },
        //   params: {
        //     page: currentPage,
        //     pageSize: pageSize, // or use a separate pageSize state variable
        //   },
        // });
        // console.log(response.data);

        // setTotalPageCount(response.data.totalPages)

        const updatedData = response.data.data.map((item) => ({
          ...item,
          key: item.user_id, // Assign user_id as the key
        }));

        const activeData = updatedData
          .filter((item) => item.active === "yes" || item.active === "no")
          .sort((a, b) => a.employee_id - b.employee_id);

        const pendingData = updatedData
          .filter((item) => item.active === "pending")
          .sort((a, b) => a.employee_id - b.employee_id);

        setFilteredData(activeData);
        setPendingUsers(pendingData);
        setGenData(activeData);
      } catch (error) {
        console.error(error);
        // Handle error state or display an error message
      }
    };

    const debouncedFetchData = debounce(fetchData, 500); // Debounce fetchData function

    debouncedFetchData(); // Call the debounced function

    return () => {
      // Clean up the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, [currentPage]);

  //console.log(data)

  const handleCompleteProfile = (record) => {
    if (record.release_date === "Invalid date") {
      record.release_date = "Select Date";
    }
    if (record.end_of_contract === "Invalid date") {
      record.end_of_contract = "Select Date";
    }
    if (record.joining_date === "Invalid date") {
      record.joining_date = "Select Date";
    }

    setSelectedRecord(record); // Set the selected profile data
    setCompleteProfileModalOpen(true); // Open the profile modal
    setType(record.type);
    setDesignation(record.designation);
    setCurrentStatus(record.current_status);
    setEndOfContract("");
    setReleaseDate("");
    // console.log(record.release_date);
    // console.log(record.end_of_contract);
    // console.log(record.joining_date);
    setGrossSalary(record.gross_salary);
    setDepartment(record.department);
    setGAccount(record.g_account);
    setJoiningDate("");
    setProfileProgress(record.profile_completion.percentage);
    // console.log(record);
  };

  const handleProfileCompletionModal = async () => {
    // Validation checks
    const currentDate = new Date();

    if (
      endOfContract &&
      releaseDate &&
      (endOfContract <= currentDate || releaseDate <= currentDate)
    ) {
      Modal.error({
        title: "Invalid date",
        content: "End of Contract and Release Date must be in the future.",
      });
      return;
    }

    if (gAccount && !gAccount.endsWith("@dreamonline.co.jp")) {
      Modal.error({
        title: "Invalid email",
        content: "G-account must end with '@dreamonline.co.jp'.",
      });
      return;
    }

    if (grossSalary && parseFloat(grossSalary) <= 0) {
      Modal.error({
        title: "Invalid salary",
        content: "Gross Salary must be greater than zero.",
      });
      return;
    }

    // console.log(secret_key);

    // var encryptedGrossSalary = CryptoJS.AES.encrypt(
    //   JSON.stringify(grossSalary),
    //   `${secret_key}`
    // ).toString();

    // Prepare the data to be sent to the backend
    const updatedFields = {
      type: type,
      designation: designation,
      current_status: currentStatus,
      end_of_contract: endOfContract,
      release_date: releaseDate,
      gross_salary: grossSalary,
      department: department,
      g_account: gAccount,
      joining_date: joiningDate,
    };

    // console.log(updatedFields)

    // Send the data to the backend
    const token = sessionStorage.getItem("token");
    const response = await axios
      .post(
        `${base_url}/api/v1/admin/client-profile-completion/${selectedRecord.user_id}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log("Profile updated successfully:", response.data);

        // Handle the response and update the UI as needed
        const updatedUser = response.data.data;
        const updatedData = filteredData.map((user) =>
          user.key === selectedRecord.key ? updatedUser : user
        );

        setFilteredData(updatedData);
        // Close the modal or perform any other action
        setType("");
        setDesignation("");
        setCurrentStatus("");
        setEndOfContract("");
        setReleaseDate("");
        setGrossSalary("");
        setDepartment("");
        setGAccount("");
        setJoiningDate("");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        // Handle error or show error message
      });

    setCompleteProfileModalOpen(false);
  };

  const handleCloseProfileModal = () => {
    setSelectedRecord(null);
    setCompleteProfileModalOpen(false);
  };

  const handleView = (record) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontSize: "22px",
            fontWeight: "normal",
            marginBottom: "5px",
            color: "#00B0F0",
          }}
        >
          User Information
        </div>
      ),
      centered: true,
      content: (
        <div>
          <p>ID: {record.employee_id}</p>
          <p>Name: {record.name}</p>
          <p>Email: {record.email}</p>
        </div>
      ),
      okText: "Edit",
      cancelText: "Ok",
      icon: <InfoCircleTwoTone style={{ color: "#FFC107" }} />,
      onOk() {
        handleEdit(record);
      },
    });
  };

  const handleEdit = (record) => {
    setEditInfoModalOpen(true);
    setSelectedRecord(record);
    setId(record.employee_id);
    setName(record.name);
  };

  const handleEditModalOk = async () => {
    try {
      // Validate ID (between 1 and 30000)
      if (isNaN(id) || id < 1 || id > 30000) {
        Modal.error({
          title: "Invalid ID",
          content: "Provide a valid user ID",
        });
        return;
      }

      // Create the request body with the updated data
      const requestBody = {
        name: name,
        employee_id: id,
      };

      // Make a PUT request to update the user
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${base_url}/api/v1/admin/users/update/${selectedRecord.user_id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response and update the UI as needed
      const updatedUser = response.data.data;
      const updatedData = filteredData.map((user) =>
        user.key === selectedRecord.key ? updatedUser : user
      );

      setFilteredData([...updatedData]);
      setGenData([...updatedData]);

      setId("");
      setName("");
      setEditInfoModalOpen(false);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleCancel = () => {
    setId("");
    setName("");
    setSelectedRecord(null);
    setEditInfoModalOpen(false);
  };

  const handleViewHistory = async (record) => {
    setOrderHistoryRecord(record);
    setOrderHistoryModalOpen(true);
  };

  const handleChangePassword = (record) => {
    const activeStatus = filteredData.find(
      (data) => data.user_id === record.user_id
    )?.active;

    if (activeStatus === "yes") {
      Modal.confirm({
        title: (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "14px" }}>
              Are you sure that you want to reset the password?
            </div>
          </div>
        ),
        okText: "Yes",
        cancelText: "No",
        centered: true,
        okButtonProps: { style: { marginRight: "35%" } },
        bodyStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        onOk: () => {
          const user_id = record.user_id;
          const email = record.email;

          // Send a POST request to change the password
          const token = sessionStorage.getItem("token");
          setLoading(true);
          axios
            .post(
              `${base_url}/api/v1/admin/users/changePassword/${user_id}`,
              { email },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              Modal.success({
                title: (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "14px" }}>
                      A temporary password has been sent to the user.
                    </div>
                  </div>
                ),
                centered: true,
                okButtonProps: { style: { marginRight: "40%" } },
                bodyStyle: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              });
            })
            .catch((error) => {
              console.error(error);
              // Handle error state or display an error message
            });
        },
      });
    } else {
      notification.error({
        message: "Error",
        description: "Cannot reset password for inactive users.",
        placement: "bottomRight",
      });
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    if (value === "") {
      setFilteredData(genData);
    } else {
      const filtered = genData.filter(
        (item) =>
          item.employee_id.toString().includes(value) ||
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredData(filtered);
    }
  };

  const handleActive = async (record) => {
    try {
      if (record.active === "yes") {
        Modal.confirm({
          title: (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>
                Are you sure you want to deactivate this user?
              </div>
            </div>
          ),
          centered: true,
          onOk: async () => {
            const updatedData = filteredData.map((item) =>
              item.user_id === record.user_id ? { ...item, active: "no" } : item
            );
            setFilteredData(updatedData);

            const token = sessionStorage.getItem("token");
            const response = await axios.post(
              `${base_url}/api/v1/admin/users/updateStatus/${record.user_id}`,
              { active: "no" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // Handle the response if needed
          },
          okButtonProps: { style: { marginRight: "35%" } },
          bodyStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        });
      } else {
        const updatedData = filteredData.map((item) =>
          item.user_id === record.user_id ? { ...item, active: "yes" } : item
        );
        setFilteredData(updatedData);

        const token = sessionStorage.getItem("token");
        const response = await axios.post(
          `${base_url}/api/v1/admin/users/updateStatus/${record.user_id}`,
          { active: "yes" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Handle the response if needed
      }
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Validate ID (between 1 and 30000)
      if (isNaN(id) || id < 1 || id > 600000) {
        Modal.error({
          title: "Invalid ID",
          content: "Provide a valid user ID",
        });
        return;
      }

      // Validate email (should have "@dreamonline.co.jp" domain)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.match(emailRegex) || !email.endsWith("@dreamonline.co.jp")) {
        Modal.error({
          title: "Invalid Email",
          content: 'Email should have "@dreamonline.co.jp" domain',
        });
        return;
      }

      const token = sessionStorage.getItem("token");

      const requestBody = {
        name: name,
        employee_id: id,
        email: email,
      };

      setLoading(true);
      // Make a POST request to create a new user
      const response = await axios.post(
        `${base_url}/api/v1/admin/users`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);

      if (response.data.code === 200) {
        // Handle the response and update the UI as needed
        const { data } = response.data;

        setFilteredData([...filteredData, data]);
        setGenData([...filteredData]);
        // setGenData([...genData]);
        // setFilteredData([...genData])
        setId("");
        setName("");
        setEmail("");
        setFormModalOpen(false);
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
      setLoading(false);
      setWarningModal(true);
    }
  };

  const handleAccept = async (record) => {
    try {
      const { user_id } = record;

      // Send a POST request to update the user's status to "yes"
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${base_url}/api/v1/admin/users/addPending/${user_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Assuming the response data contains the updated user
      const updatedUser = response.data.data;

      // Update the filteredData state with the updated user
      setFilteredData((prevData) => [...prevData, updatedUser]);
      // Remove the accepted user from the pendingUsers state
      setPendingUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== record.user_id)
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleAcceptAll = async () => {
    try {
      const token = sessionStorage.getItem("token");

      // Array to hold the promises for each POST request
      const createPromises = [];

      // Iterate over the pendingUsers array and create a POST request for each user
      pendingUsers.forEach((user) => {
        // Send a POST request to update the user's status to "yes"
        const createPromise = axios.post(
          `${base_url}/api/v1/admin/users/addPending/${user.user_id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Add the promise to the array
        createPromises.push(createPromise);
      });

      // Wait for all the POST requests to complete
      await Promise.all(createPromises);

      // Clear the pendingUsers state
      setPendingUsers([]);
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleReject = async (record) => {
    try {
      const token = sessionStorage.getItem("token");
      const user_id = record.user_id;

      // Send a DELETE request to delete the user
      await axios.delete(`${base_url}/api/v1/admin/users/delete/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the rejected user from the pendingUsers state
      setPendingUsers((prevPendingUsers) =>
        prevPendingUsers.filter((user) => user.user_id !== record.user_id)
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleRejectAll = async () => {
    try {
      const token = sessionStorage.getItem("token");

      // Create an array to hold the delete promises
      const deletePromises = [];

      // Iterate over the pendingUsers array and create a delete promise for each user
      pendingUsers.forEach((user) => {
        // Create the delete promise
        const deletePromise = axios.delete(
          `${base_url}/api/v1/admin/users/delete/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Add the promise to the array
        deletePromises.push(deletePromise);
      });

      // Wait for all the delete requests to complete
      await Promise.all(deletePromises);

      // Clear the pendingUsers state
      setPendingUsers([]);
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handlePagination = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
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
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search id, name or email"
          onChange={handleSearch}
          style={{ width: "300px", marginRight: "20px" }}
        />
        <Button
          type="primary"
          onClick={() => setPendingModalOpen(true)}
          style={{
            float: "right",
            marginLeft: "10px",
            backgroundColor: "rgb(0, 176, 240)",
          }}
        >
          Pending users
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {pendingUsers ? pendingUsers.length : 0}
          </span>
        </Button>
        <Button
          type="primary"
          onClick={() => setFormModalOpen(true)}
          style={{ float: "right", backgroundColor: "rgb(0, 176, 240)" }}
        >
          Add Users
        </Button>
      </div>
      <Modal
        title={
          <span>
            {/* <ExclamationCircleOutlined style={{ marginRight: "8px" }} /> Warning */}
            <img
              src={warningIcon}
              alt="warningIcon"
              width="28px"
              height="28px"
            />{" "}
            &nbsp;Warning
          </span>
        }
        open={showWarningModal}
        style={{ display: "grid" }}
        cancelButtonProps={{ style: { display: "none" } }}
        footer={[
          <Button
            key="ok"
            type="primary"
            style={{ backgroundColor: "rgb(0,176,224)" }}
            onClick={handleWarningModal}
          >
            OK
          </Button>,
        ]}
      >
        <p>
          User with such information already exists! Try with another
          credentials.
        </p>
      </Modal>
      <Modal
        title={
          <>
            <div
              style={{
                textAlign: "center",
                fontSize: "32px",
                fontWeight: "normal",
                marginBottom: "20px",
                color: "#00B0F0",
              }}
            >
              Portal
            </div>
            <div style={{ textAlign: "center", fontSize: "14px" }}>
              Please give information to register a user
            </div>
          </>
        }
        centered
        open={formModalOpen}
        onOk={handleFormSubmit}
        onCancel={() => setFormModalOpen(false)}
        okText="Add"
        disabled={loading}
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="id" style={{ marginBottom: "5px" }}>
            ID:
          </label>
          <Input
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={loading} // Disable the input when loading is true
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="name" style={{ marginBottom: "5px" }}>
            Name:
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading} // Disable the input when loading is true
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email" style={{ marginBottom: "5px" }}>
            Email:
          </label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "15px" }}
            disabled={loading} // Disable the input when loading is true
          />
        </div>
      </Modal>
      <Modal
        open={loading}
        // onCancel={() => setLoading(false)}
        footer={null}
        centered
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <p>Please wait</p>
        </div>
      </Modal>
      <Modal
        title="Pending Users"
        centered
        open={pendingModalOpen}
        onOk={() => setPendingModalOpen(false)}
        onCancel={() => setPendingModalOpen(false)}
        width={"900px"}
        bodyStyle={{ maxHeight: "350px", minHeight: "350px", overflow: "auto" }}
        footer={[
          <Button
            key="acceptAll"
            type="primary"
            onClick={handleAcceptAll}
            style={{ float: "left" }}
          >
            Accept all
          </Button>,
          <Button
            key="rejectAll"
            type="primary"
            danger
            onClick={handleRejectAll}
            style={{ float: "left" }}
          >
            Reject all
          </Button>,
          <Button key="close" onClick={() => setPendingModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <MyTable
          columns={pendingUserColumn}
          dataSource={pendingUsers}
          pageSize={3}
        />
      </Modal>
      <Modal
        title="Edit User Information"
        open={editInfoModalOpen}
        onCancel={handleCancel}
        onOk={() => handleEditModalOk()}
        centered
      >
        <div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="id" style={{ marginBottom: "5px" }}>
              ID:
            </label>
            <Input
              type="text"
              id="id"
              placeholder={selectedRecord ? selectedRecord.id : ""}
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="name" style={{ marginBottom: "5px" }}>
              Name:
            </label>
            <Input
              type="text"
              id="name"
              placeholder={selectedRecord ? selectedRecord.name : ""}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      {orderHistoryModalOpen && (
        <OrderHistoryTable
          orderHistoryModalOpen={orderHistoryModalOpen}
          setOrderHistoryModalOpen={setOrderHistoryModalOpen}
          record={orderHistoryRecord}
        />
      )}
      {/* complete user Profile Modal */}
      <Modal
        open={completeProfileModalOpen}
        // onOk={handleProfileCompletionModal}
        onCancel={handleCloseProfileModal}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleProfileCompletionModal}
          >
            Submit
          </Button>,
          <Button
            type="primary"
            key="cancel"
            danger
            onClick={handleCloseProfileModal}
          >
            Cancel
          </Button>,
        ]}
        width={600} // Set the modal's width
      >
        <Form layout="vertical">
          <h2>Profile Completion</h2>
          <Form.Item
            label="Type"
            style={{ marginBottom: 10 }}
            // placeholder={selectedRecord ? selectedRecord.type : ""}
          >
            <Select
              value={type}
              onChange={(e) => setType(e)}
              placeholder={selectedRecord ? selectedRecord.type : ""}
            >
              <Option value="permanent">Permanent</Option>
              <Option value="contractual">Contractual</Option>
              <Option value="internship">Internship</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Designation" style={{ marginBottom: 10 }}>
            <Input
              value={designation}
              placeholder={selectedRecord ? selectedRecord.designation : ""}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Current Status"
            style={{ marginBottom: 10 }}
            placeholder={selectedRecord ? selectedRecord.current_status : ""}
          >
            <Select value={currentStatus} onChange={(e) => setCurrentStatus(e)}>
              <Option value="active">Active</Option>
              <Option value="retired">Retired</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </Form.Item>
          <Form.Item label="End of Contract" style={{ marginBottom: 10 }}>
            <DatePicker
              value={endOfContract}
              onChange={(date) => setEndOfContract(date)}
              placeholder={
                selectedRecord ? selectedRecord.end_of_contract : new Date()
              }
            />
          </Form.Item>
          <Form.Item label="Release Date" style={{ marginBottom: 10 }}>
            <DatePicker
              value={releaseDate}
              onChange={(date) => setReleaseDate(date)}
              placeholder={
                selectedRecord ? selectedRecord.release_date : new Date()
              }
            />
          </Form.Item>
          <Form.Item label="Gross Salary" style={{ marginBottom: 10 }}>
            <Input
              value={grossSalary}
              placeholder={selectedRecord ? selectedRecord.gross_salary : ""}
              onChange={(e) => setGrossSalary(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Department" style={{ marginBottom: 10 }}>
            <Input
              value={department}
              placeholder={selectedRecord ? selectedRecord.department : ""}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="G-account" style={{ marginBottom: 10 }}>
            <Input
              value={gAccount}
              placeholder={selectedRecord ? selectedRecord.g_account : ""}
              onChange={(e) => setGAccount(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Joining Date" style={{ marginBottom: 10 }}>
            <DatePicker
              value={joiningDate}
              onChange={(date) => setJoiningDate(date)}
              placeholder={
                selectedRecord ? selectedRecord.joining_date : new Date()
              }
            />
          </Form.Item>
          {/* Profile Completion Status */}
          <div style={{ marginBottom: 20 }}>
            <Progress
              // type="circle"
              percent={
                selectedRecord
                  ? selectedRecord.profile_completion.percentage
                  : ""
              }
              format={(percent) => `${percent}%`}
            />
          </div>
        </Form>
      </Modal>
      {/* <MyTable columns={columns} dataSource={filteredData} pageSize={8} /> */}
      <MyTable
        columns={columns}
        dataSource={filteredData}
        pageSize={8}
        totalPages={totalPageCount}
        onPageChange={handlePagination}
      />
      {/* <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 8 }} /> */}
    </div>
  );
};

export default UserListLayout;
