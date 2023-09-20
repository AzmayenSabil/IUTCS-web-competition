import React, { useEffect, useState } from "react";
import { Button, Input, Table, Modal, Tooltip, Spin } from "antd";

import Switch from "@mui/material/Switch";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MyTable from "../../utils/myTable/MyTableLayout";
import axios from "axios";
import { debounce } from "lodash";

const { Search } = Input;

const AdminListLayout = () => {
  const [genData, setGenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [selectedGender, setSelectedGender] = useState("");
  const [genderWarning, setGenderWarning] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [loading, setLoading] = useState(false); // New loading state
  const base_url = process.env.REACT_APP_BASE_URL;

  const columns = [
    {
      title: "Admin ID",
      dataIndex: "admin_id",
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
            onClick={() => handleEdit(record)}
            style={{ color: "green" }}
          >
            <Tooltip title="Edit">
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const clientId = JSON.parse(
          sessionStorage.getItem("clientInfo")
        ).user_id;

        const response = await axios.get(
          `${base_url}/api/v1/admin/admins/getAllAdmins`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filter the response data to exclude items with the same user_id
        const responseData = response.data.data.filter(
          (item) => item.user_id !== clientId
        );

        const newData = responseData.map((item, index) => ({
          key: item.user_id,
          admin_id: item.admin_id,
          email: item.email,
          name: item.name,
          active: item.active,
        }));

        // Sort by vendor name
        newData.sort((a, b) => {
          const adminA = a.admin_id;
          const adminB = b.admin_id;
          if (adminA < adminB) {
            return -1;
          }
          if (adminA > adminB) {
            return 1;
          }
          return 0;
        });

        // Log or use the filtered data as needed
        // console.log(newData);
        setFilteredData(newData);
        setGenData(newData);
      } catch (error) {
        console.error(error);
        // Handle error state or display an error message
      }
    };

    const debouncedFetchData = debounce(fetchData, 500); // Adjust the debounce delay as needed

    debouncedFetchData();

    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  //console.log(genData);

  const handleEdit = (record) => {
    //console.log(record)
    setSelectedRecord(record);
    setEmail(record.email);
    setName(record.name);
    setAdminId(record.admin_id);
    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const user_id = selectedRecord.key; // Assuming the admin's user_id is used as the identifier

      // Validate ID (between 1 and 30000)
      if (isNaN(adminId) || adminId < 1 || adminId > 30000) {
        Modal.error({
          title: "Invalid ID",
          content: "Provide a valid admin ID",
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

      const response = await axios.post(
        `${base_url}/api/v1/admin/admins/update/${user_id}`,
        {
          name,
          admin_id: adminId,
          email,
          // other fields you want to update...
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create updated data format from response
      const updatedAdminData = {
        key: response.data.data.user_id,
        admin_id: response.data.data.admin_id,
        email: response.data.data.email,
        name: response.data.data.name,
        active: response.data.data.active,
        // Include other fields as needed
      };

      // Update the UI by replacing the admin record in filteredData
      const updatedData = filteredData.map((admin) =>
        admin.key === selectedRecord.key ? updatedAdminData : admin
      );

      // setFilteredData(updatedData);

      const newData = [...updatedData].sort((a, b) => {
        const adminA = a.admin_id;
        const adminB = b.admin_id;
        if (adminA < adminB) {
          return -1;
        }
        if (adminA > adminB) {
          return 1;
        }
        return 0;
      });

      // setGenData([...filteredData]);
      // setGenData([...genData]);
      setFilteredData([...newData]);
      setGenData([...newData]);

      // Handle the success response
      // You can close the modal, update the admin in the filteredData array, etc.
      setEmail("");
      setName("");
      setAdminId("");
      setEditModalVisible(false);
      // ... handle updating filteredData if needed ...

      // Display a success message or perform further actions
      Modal.success({
        title: "Success",
        content: "Admin information updated successfully!",
        centered: true,
      });
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
      Modal.error({
        title: "Error",
        content:
          error.response?.data?.error ||
          "An error occurred while updating admin information.",
        centered: true,
      });
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setFormModalOpen(false);
    //changed here
    setEmail("");
    setName("");
    setAdminId("");
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalOk = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const user_id = selectedRecord.key;
      //  console.log(user_id);
      const response = await axios.delete(
        `${base_url}/api/v1/admin/admins/deleteAdmin/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the filteredData by removing the deleted admin from the array
      // setFilteredData((prevData) =>
      //   prevData.filter((item) => item.key !== user_id)
      // );

      // Update the UI by replacing the admin record in filteredData
      const updatedData = filteredData.filter((admin) => admin.key !== user_id);

      // setFilteredData(updatedData);

      const newData = [...updatedData].sort((a, b) => {
        const adminA = a.admin_id;
        const adminB = b.admin_id;
        if (adminA < adminB) {
          return -1;
        }
        if (adminA > adminB) {
          return 1;
        }
        return 0;
      });

      // setGenData([...filteredData]);
      // setGenData([...genData]);
      setFilteredData([...newData]);
      setGenData([...newData]);

      Modal.success({
        title: "Success",
        content: "Admin deleted successfully!",
        centered: true,
      });
      setDeleteModalVisible(false);
      //   console.log("deleted");
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    if (value === "") {
      setFilteredData(genData);
    } else {
      const filtered = genData.filter(
        (item) =>
          item.admin_id.toString().includes(value) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleGenderChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedGender(selectedValue);
    setGenderWarning("");
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);

      // Validate ID (between 1 and 30000)
      if (isNaN(adminId) || adminId < 1 || adminId > 30000) {
        Modal.error({
          title: "Invalid ID",
          content: "Provide a valid admin ID",
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
      //   console.log(adminId);
      //   console.log(name);
      //   console.log(email);

      const response = await axios.post(
        `${base_url}/api/v1/admin/admins/create`,
        {
          name,
          admin_id: adminId,
          email,
          gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   console.log(response.data);
      // Transform the response data to the format you want
      const newAdminData = {
        key: response.data.data.user_id,
        admin_id: response.data.data.admin_id,
        email: response.data.data.email,
        name: response.data.data.name,
        active: response.data.data.active,
      };

      // Update filteredData with the new admin data and sort by admin_id
      // setFilteredData((prevData) =>
      //   [...prevData, newAdminData].sort((a, b) => {
      //     const adminA = a.admin_id;
      //     const adminB = b.admin_id;
      //     if (adminA < adminB) {
      //       return -1;
      //     }
      //     if (adminA > adminB) {
      //       return 1;
      //     }
      //     return 0;
      //   })
      // );
      // setGenData([...filteredData])
      // setGenData([...genData])
      // setFilteredData([...genData])
      // console.log(filteredData)
      // console.log(genData)

      // Update the filteredData array and sort it based on package name
      const updatedData = [...filteredData, newAdminData].sort((a, b) => {
        const adminA = a.admin_id;
        const adminB = b.admin_id;
        if (adminA < adminB) {
          return -1;
        }
        if (adminA > adminB) {
          return 1;
        }
        return 0;
      });

      // setGenData([...filteredData]);
      // setGenData([...genData]);
      setFilteredData([...updatedData]);
      setGenData([...updatedData]);

      // Display a success message or perform further actions
      Modal.success({
        title: "Success",
        content: "Admin created successfully!",
        centered: true,
      });
      setEmail("");
      setName("");
      setAdminId("");
      setFormModalOpen(false);
    } catch (error) {
      //console.error(error);
      // Handle error state or display an error message
      Modal.error({
        title: "Error",
        content: error.response.data.error,
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActive = async (record) => {
    try {
      if (record.active === "yes") {
        Modal.confirm({
          title: (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>
                Are you sure you want to deactivate this admin?
              </div>
            </div>
          ),
          centered: true,
          onOk: async () => {
            const updatedData = filteredData.map((item) =>
              item.admin_id === record.admin_id
                ? { ...item, active: "no" }
                : item
            );
            setFilteredData(updatedData);

            const token = sessionStorage.getItem("token");
            const response = await axios.post(
              `${base_url}/api/v1/admin/admins/updateStatus/${record.key}`,
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
          item.admin_id === record.admin_id ? { ...item, active: "yes" } : item
        );
        setFilteredData(updatedData);

        const token = sessionStorage.getItem("token");
        const response = await axios.post(
          `${base_url}/api/v1/admin/admins/updateStatus/${record.key}`,
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
          placeholder="Search admins"
          onChange={handleSearch}
          style={{ width: "300px", marginRight: "20px" }}
        />
        <Button
          type="primary"
          onClick={() => setFormModalOpen(true)}
          style={{ float: "right", backgroundColor: "rgb(0, 176, 240)" }}
        >
          Add Admin
        </Button>
      </div>
      {/* Edit Modal */}
      <Modal
        title="Edit Record"
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleModalCancel}
        okText="Submit"
        centered
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email" style={{ marginBottom: "5px" }}>
            Email:
          </label>
          <Input
            id="email"
            placeholder={selectedRecord ? selectedRecord.email : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="name" style={{ marginBottom: "5px" }}>
            Name:
          </label>
          <Input
            id="name"
            placeholder={selectedRecord ? selectedRecord.name : ""}
            value={name}
            onChange={(e) => setName(`${e.target.value}`)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="adminId" style={{ marginBottom: "5px" }}>
            Admin ID:
          </label>
          <Input
            id="adminId"
            placeholder={selectedRecord ? selectedRecord.adminId : ""}
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            style={{ marginBottom: "15px" }}
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete Record"
        open={deleteModalVisible}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
        okButtonProps={{ danger: true }}
        centered
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this admin?</p>
      </Modal>

      {/* Add Admin  Modal*/}
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
              Please give information to add an admin
            </div>
          </>
        }
        centered
        open={formModalOpen}
        onOk={handleFormSubmit}
        onCancel={handleModalCancel}
        okText="Add"
        okButtonProps={{
          // Disable the "Add" button when loading is true
          disabled: loading,
        }}
      >
        {/* Conditional rendering based on the loading state */}
        {loading ? (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: "10px" }}>Adding admin...</div>
          </div>
        ) : (
          <>
            {/* Form input fields */}
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="adminId" style={{ marginBottom: "5px" }}>
                Admin ID:
              </label>
              <Input
                id="id"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="email" style={{ marginBottom: "5px" }}>
                Email:
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                min={0}
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
                style={{ marginBottom: "15px" }}
              />
            </div>
            <div className="mb-4">
              <label className="mb-1" htmlFor="gender">
                Gender:
              </label>
              <select
                className={`form-select ${genderWarning ? "is-invalid" : ""}`}
                value={selectedGender}
                onChange={handleGenderChange}
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {genderWarning && (
                <div className="invalid-feedback">{genderWarning}</div>
              )}
            </div>
          </>
        )}
      </Modal>

      <MyTable columns={columns} dataSource={filteredData} pageSize={8} />
    </div>
  );
};

export default AdminListLayout;
