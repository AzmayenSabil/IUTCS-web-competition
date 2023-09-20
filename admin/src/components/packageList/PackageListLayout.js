import React, { useEffect, useState } from "react";
import { Button, Input, Table, Modal, Tooltip } from "antd";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MyTable from "../../utils/myTable/MyTableLayout";
import axios from "axios";
import { debounce } from "lodash";

const { Search } = Input;

const PackageListLayout = () => {
  const [genData, setGenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [packages, setPackages] = useState("");
  const [price, setPrice] = useState("");
  const [vendor, setVendor] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const base_url = process.env.REACT_APP_BASE_URL;

  const columns = [
    {
      title: "Package",
      dataIndex: "packages",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
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
  ];

  let data = [];
  const currencyIcon = "৳";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(`${base_url}/api/v1/admin/packages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newData = response.data.data.map((item, index) => ({
          key: item.package_id,
          packages: item.name,
          price: `${currencyIcon} ${item.price}`,
          vendor: item.vendor,
        }));

        // Sort by vendor name
        newData.sort((a, b) => {
          const vendorA = a.vendor.toLowerCase();
          const vendorB = b.vendor.toLowerCase();
          if (vendorA < vendorB) {
            return -1;
          }
          if (vendorA > vendorB) {
            return 1;
          }
          return 0;
        });

        setFilteredData(newData);
        setGenData(newData);
        data = newData;
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
    setPackages(record.packages);
    setPrice(record.price.replace(currencyIcon, "").trim());
    setVendor(record.vendor);
    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const packageId = selectedRecord.key;

      const updatedRecord = {
        name: packages,
        price,
        vendor,
        active: "yes",
      };

      // Make the PUT request to update the package data
      const res = await axios.put(
        `${base_url}/api/v1/admin/packages/${packageId}`,
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log(res.data.data);

      // Format the price field with the currency icon before updating the filteredData array
      const formattedPrice = `${currencyIcon} ${res.data.data.price}`;
      const packageName = res.data.data.name;

      // Update the filteredData array with the API response data and the formatted price
      // setFilteredData((prevFilteredData) =>
      //   prevFilteredData.map((item) =>
      //     item.key === selectedRecord.key
      //       ? {
      //           ...item,
      //           ...res.data.data,
      //           packages: packageName,
      //           price: formattedPrice,
      //         }
      //       : item
      //   )
      // );

      // Update the UI by replacing the admin record in filteredData
      const updatedData = filteredData.map((item) =>
        item.key === selectedRecord.key
          ? {
              ...item,
              ...res.data.data,
              packages: packageName,
              price: formattedPrice,
            }
          : item
      );

      // setFilteredData(updatedData);

      // Sort by vendor name
      const newData = updatedData.sort((a, b) => {
        const vendorA = a.vendor.toLowerCase();
        const vendorB = b.vendor.toLowerCase();
        if (vendorA < vendorB) {
          return -1;
        }
        if (vendorA > vendorB) {
          return 1;
        }
        return 0;
      });

      // setGenData([...filteredData]);
      // setGenData([...genData]);
      setFilteredData([...newData]);
      setGenData([...newData]);

      // Clear the input fields and close the edit modal
      setPackages("");
      setPrice("");
      setVendor("");
      setEditModalVisible(false);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    //changed here
    setPackages("");
    setPrice("");
    setVendor("");
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalOk = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const packageId = selectedRecord.key;

      setDeleteModalVisible(false);

      // Call the API to check if the package has associated menus with orders
      const response = await axios.get(
        `${base_url}/api/v1/admin/packages/verify/${packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const hasAssociatedMenu = response.data.result;

      if (hasAssociatedMenu) {
        // Show warning modal that package has an associated menu and cannot be deleted
        Modal.warning({
          title: "Cannot Delete Package",
          content: "This package has an associated menu and cannot be deleted.",
          centered: true,
        });
      } else {
        // Show confirmation modal before deleting
        Modal.confirm({
          title: "Delete Package",
          content:
            "If you delete this package, the associated menu will also be deleted.",
          onOk: async () => {
            // Perform the delete operation
            const res = await axios.delete(
              `${base_url}/api/v1/admin/packages/${packageId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // console.log(res)
            // console.log(filteredData)
            // setFilteredData((prevFilteredData) =>
            //   prevFilteredData.filter((item) => item.key !== selectedRecord.key)
            // );

            // Update the UI by replacing the admin record in filteredData
            const updatedData = filteredData.filter(
              (item) => item.key !== selectedRecord.key
            );
            // console.log(updatedData)

            // setFilteredData(updatedData);

            const newData = updatedData.sort((a, b) => {
              const vendorA = a.vendor.toLowerCase();
              const vendorB = b.vendor.toLowerCase();
              if (vendorA < vendorB) {
                return -1;
              }
              if (vendorA > vendorB) {
                return 1;
              }
              return 0;
            });
            // console.log(newData)

            // setGenDatfilteredData
            // setGenData([...genData]);
            setFilteredData([...newData]);
            setGenData([...newData]);
            // console.log(filteredData)
          },
          onCancel: () => {
            // Handle cancel action
          },
          okText: "Delete",
          cancelText: "Cancel",
          centered: true,
        });
      }
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
          item.vendor.toLowerCase().includes(value.toLowerCase()) ||
          item.packages.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleFormSubmit = async () => {
    // Validate price (between 1 and 30000)
    if (isNaN(price) || price < 1 || price > 30000) {
      Modal.error({
        title: "Invalid price",
        content: "Please check the price of the package",
      });
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${base_url}/api/v1/admin/packages`,
        {
          name: packages,
          price: price,
          vendor: vendor,
          active: "yes",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //console.log(response.data)

      // If the response code is 200, the package was added successfully
      if (response.data.code === 200) {
        Modal.success({
          title: "Success",
          content: "New package added successfully!",
          centered: true,
        });

        // const newItemKey = filteredData.length + 1;
        const newItem = {
          key: response.data.data.package_id,
          packages: packages,
          price: `${currencyIcon} ${price}`,
          vendor: vendor,
        };

        // Update the filteredData array and sort it based on package name
        // const updatedData = [...filteredData, newItem].sort((a, b) => {
        //   return a.vendor.localeCompare(b.vendor);
        // });

        // setFilteredData([...updatedData]);
        // setGenData([...filteredData]);
        // Update the filteredData array and sort it based on package name
        const updatedData = [...filteredData, newItem].sort((a, b) => {
          const vendorA = a.vendor.toLowerCase();
          const vendorB = b.vendor.toLowerCase();
          if (vendorA < vendorB) {
            return -1;
          }
          if (vendorA > vendorB) {
            return 1;
          }
          return 0;
        });

        // setGenData([...filteredData]);
        // setGenData([...genData]);
        setFilteredData([...updatedData]);
        setGenData([...updatedData]);

        setPackages("");
        setPrice("");
        setVendor("");
        setFormModalOpen(false);
      }
    } catch (error) {
      //console.error(error);
      // Handle error state or display an error message
      Modal.error({
        title: "Error",
        content: error.response.data.error,
      });
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
          placeholder="Search package name or vendor"
          onChange={handleSearch}
          style={{ width: "300px", marginRight: "20px" }}
        />
        <Button
          type="primary"
          onClick={() => setFormModalOpen(true)}
          style={{ float: "right", backgroundColor: "rgb(0, 176, 240)" }}
        >
          Add Package
        </Button>
      </div>
      {/* Edit Modal */}
      <Modal
        title="Edit Record"
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Submit"
        centered
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="pacakges" style={{ marginBottom: "5px" }}>
            Package:
          </label>
          <Input
            id="packages"
            placeholder={selectedRecord ? selectedRecord.packages : ""}
            value={packages}
            onChange={(e) => setPackages(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="price" style={{ marginBottom: "5px" }}>
            Price:
          </label>
          <Input
            id="price"
            placeholder={selectedRecord ? selectedRecord.price : ""}
            value={price}
            onChange={(e) => setPrice(`${e.target.value}`)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="vendor" style={{ marginBottom: "5px" }}>
            Vendor:
          </label>
          <Input
            id="vendor"
            placeholder={selectedRecord ? selectedRecord.vendor : ""}
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
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
        <p>Are you sure you want to delete this package?</p>
      </Modal>
      {/* Add package  Modal*/}
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
              Please give information to add a package
            </div>
          </>
        }
        centered
        open={formModalOpen}
        onOk={handleFormSubmit}
        onCancel={() => setFormModalOpen(false)}
        okText="Add"
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="pacakges" style={{ marginBottom: "5px" }}>
            Package:
          </label>
          <Input
            id="packages"
            value={packages}
            onChange={(e) => setPackages(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="price" style={{ marginBottom: "5px" }}>
            Price:
          </label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="vendor" style={{ marginBottom: "5px" }}>
            Vendor:
          </label>
          <Input
            id="vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            style={{ marginBottom: "15px" }}
          />
        </div>
      </Modal>

      <MyTable columns={columns} dataSource={filteredData} pageSize={8} />
    </div>
  );
};

export default PackageListLayout;
