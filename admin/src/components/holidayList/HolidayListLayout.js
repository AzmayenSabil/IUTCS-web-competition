

import moment from "moment";
import axios from "axios";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Card,
  Upload,
  Col,
  Row,
  Button,
  Input,
  Popconfirm,
  Table,
  Modal,
  Badge,
  Space,
  Tag,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import HolidayLoaderLayout from "../screenLoader/HolidayLoaderLayout";

const HolidayListLayout = () => {
  const [fileList, setFileList] = useState([]);
  // const onChange = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  // };

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [holidayId, setHolidayId] = useState("");
  const [holidayName, setHolidayName] = useState("");
  const [addHolidayDate, setAddedHolidayDate] = useState("")
  const [addHolidayName, setAddedHolidayName] = useState("")
  const [dataSource, setDataSource] = useState([]);
  const [genData, setGenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorForHolidayDate, setErrorForHolidayDate] = useState("")
  const [errorForHolidayName, setErrorForHolidayName] = useState("")
  const [successModalOnDelete, setSuccessModalOnDelete] = useState(false)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [showResetButton, setShowResetButton] = useState(false);



  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setErrorForHolidayDate("")
    setErrorForHolidayName("")
    setAddedHolidayDate("")
    setAddedHolidayName("")
    setOpen(false);
  };


  const base_url = process.env.REACT_APP_BASE_URL;

  const onChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
    setFileList(fileList);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");

      const formData = new FormData();

      formData.append('file', file);


      const response = await axios.post(`${base_url}/api/v1/admin/holiday/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`

        },
      });

      // Handle the success response if needed
      // console.log('Upload response:', response.data.data);
      // setDataSource(response.data.data);
      const newData = response.data.data.map((item) => ({
        holidayID: item.holiday_id,
        date: item.date,
        holidayName: item.holiday_name,
      }));

      setDataSource(newData);


      onSuccess();
      setTimeout(() => {
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error('Upload error:', error);
      onError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${base_url}/api/v1/admin/holiday/getAllHolidays`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newData = response.data.data.map((item) => ({
          holidayID: item.holiday_id,
          date: item.date,
          holidayName: item.holiday_name,
        }));

        setDataSource(newData);
        setGenData(dataSource)
        setTimeout(() => {
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error(error);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500);

    debouncedFetchData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [base_url]);

  const handleDelete = async (holidayID) => {
    // console.log(`Deleting item with holidayID: ${holidayID}`);

    try {
      const token = sessionStorage.getItem("token");

      await axios.delete(
        `${base_url}/api/v1/admin/holiday/deleteHoliday/${holidayID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newData = dataSource.filter((item) => item.holidayID !== holidayID);
      setDataSource(newData);
      setSuccessModalOnDelete(true)
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleEdit = (record) => {
    setHolidayId(record.holidayID);
    setHolidayName(record.holidayName);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const updatedRecord = {
        name: holidayName,
        holidayID: holidayId
      };

      // console.log("Sending PUT request with data:", updatedRecord);

      const res = await axios.put(
        `${base_url}/api/v1/admin/holiday/editholiday`,
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("Response from server:", res.data);

      const updatedHolidayName = res.data.data.holiday_name;

      const newData = dataSource.map((item) =>
        item.holidayID === holidayId
          ? { ...item, holidayName: updatedHolidayName }
          : item
      );

      setDataSource(newData);
      setHolidayId("");
      setHolidayName("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddHolidayDateChange = (e) => {
    setAddedHolidayDate(e.target.value);
    // Clear the error message when the user starts typing again
    setErrorForHolidayDate('');
  };

  const handleAddHolidayNameChange = (e) => {
    setAddedHolidayName(e.target.value);
    // Clear the error message when the user starts typing again
    setErrorForHolidayName('');
  };

  const handleAdd = async () => {
    try {


      // console.log(addHolidayDate, addHolidayName)
      if (!addHolidayDate) {
        setErrorForHolidayDate('Please fill up the date field');

      } else {
        setErrorForHolidayDate('');
      }

      if (!addHolidayName) {
        setErrorForHolidayName('Please fill up the holiday name field');

      } else {
        setErrorForHolidayName('');
      }

      if (!addHolidayDate && !addHolidayName) {
        return;
      }


      const holidayData = {
        date: addHolidayDate,
        holiday_name: addHolidayName,
      };

      // console.log("Sending POST request with data:", holidayData);

      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        `${base_url}/api/v1/admin/holiday/addholiday`,
        holidayData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("Response from server:", response.data);
      const newData = response.data.data.map((item) => ({
        holidayID: item.holiday_id,
        date: item.date,
        holidayName: item.holiday_name,
      }));

      setDataSource(newData);
      setAddedHolidayDate("")
      setAddedHolidayName("")
      setErrorForHolidayDate("")
      setErrorForHolidayName("")

      // console.log('Holiday added successfully');
      hideModal();
      setShowSuccessModal(true);


    } catch (error) {
      // Handle errors
      console.error('Error adding holiday:', error);
    }
  };

  //calender
  const fetchHolidaysBetweenTwoDates = async () => {
    try {
      console.log("running");
      console.log(fromDate, toDate);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${base_url}/api/v1/admin/holiday/getAllHolidaysBetweenTwoDates`,

        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            from: fromDate,
            to: toDate,
          },
        }
      );

      //const fetchedHolidays = response.data.holidaysBetweenTwoDates;

      const newData = response.data.holidaysBetweenTwoDates.map((item) => ({
        holidayID: item.holiday_id,
        date: item.date,
        holidayName: item.holiday_name,
      }));
      //setHolidays(newData);
      setDataSource(newData);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setHolidays([]);
    setShowResetButton(false);
    setDataSource(genData)
  };

  useEffect(() => {
    if (fromDate && toDate) {
      setShowResetButton(true);
    } else {
      setShowResetButton(false);
    }
  }, [fromDate, toDate]);




  const columns = [
    {
      title: "Holiday Number",
      dataIndex: "holidayID",
      width: "5%",
    },
    {
      title: "Date",
      dataIndex: "date",
      width: "8%",
    },
    {
      title: "Holiday Name",
      dataIndex: "holidayName",
      width: "14%",
    },

    {
      title: "Action",
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => (
        <>
          <Space size={[0, 8]} wrap>
            <Tag color="rgb(0,176,240)" style={{ width: "70px" }}>
              <a onClick={() => handleEdit(record)} style={{ marginLeft: "10px" }}>
                <i className="fas fa-edit"></i>&nbsp;Edit
              </a>
            </Tag>
          </Space>
          <Space size={[0, 8]} wrap>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.holidayID)}
              okButtonProps={{ style: { background: "rgb(0,176,240)" } }}

            >
              <Tag color="#f50" style={{ width: "70px", marginLeft: "10px" }}>
                <a>
                  <i className="fa-solid fa-trash-can"></i>&nbsp;Delete
                </a>
              </Tag>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  const pagination = {
    pageSize: 10,
  };

  return (
    <>
      <div
        style={{
          margin: "15px 10px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Row gutter={16}>
          <Col span={7}>
            <Card
              title="Upload Holiday List"
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
              bordered={false}
            >

              <Upload
                customRequest={customRequest}
                accept=".csv"
                fileList={fileList}
                onChange={onChange}
                showUploadList={{ showDownloadIcon: false, showPreviewIcon: false }}              >
                CSV File : &nbsp;<Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Card>
          </Col>
          <Col span={9}>
          </Col>
          <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>

            <div className="addHolidayModalContainer">
              <div className="addHolidayModal">
                <Button type="primary" style={{ background: "rgb(0,176,240)" }} onClick={showModal}>
                  Add Holiday
                </Button>
                <Modal
                  title="Add New Holiday "
                  open={open}
                  onOk={handleAdd}
                  onCancel={hideModal}
                  okButtonProps={{ style: { background: "rgb(0,176,240)" } }}
                  okText="Add"
                  cancelText="Cancel"
                >
                  <hr />
                  <Input
                    placeholder="Date"
                    type="date"
                    value={addHolidayDate}
                    onChange={handleAddHolidayDateChange}
                    style={{ margin: "6px" }}
                    required
                  />
                  {errorForHolidayDate && (
                    <div style={{ paddingLeft: "11px" }}>
                      <p style={{ color: 'red' }}>{errorForHolidayDate}</p>
                    </div>
                  )}
                  <Input
                    placeholder="Name"
                    value={addHolidayName}
                    onChange={handleAddHolidayNameChange}
                    style={{ margin: "8px" }}
                    required
                  />
                  {errorForHolidayName && (
                    <div style={{ paddingLeft: "11px" }}>
                      <p style={{ color: 'red' }}>{errorForHolidayName}</p>
                    </div>
                  )}
                </Modal>
              </div>
            </div>
          </Col>

        </Row>
        <Row >
        <>
       
          <div
            style={{
              // flex: 1,
              display: "flex",
              // justifyContent: "flex-end",
              width: "700px",
              height: "70px",
              alignItems: "center",
              padding: "10px",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              borderRadius: "7px",
              boxShadow: "0px 0px 5px 0px #ccc",
              marginTop: "12px",
             
            }}
          >
            <span style={{ marginRight: "10px" }}>From:</span>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ cursor: "pointer", width: "30%" }}
            />

            <span style={{ marginLeft: "10px", marginRight: "10px" }}>To:</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ cursor: "pointer", width: "30%" }}
            />

            <Button
              type="primary"
              onClick={fetchHolidaysBetweenTwoDates}
              style={{
                backgroundColor: "rgb(0, 176, 240)",
                marginLeft: "10px",
                color: "white",
                border: "none",
              }}
            >
              Search Holidays
            </Button>

            {showResetButton && (
              <Button
                type="primary"
                style={{
                  marginLeft: "10px",
                  border: "none",
                  backgroundColor: "#f5222d",
                }}
                danger
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </div>
        

          {/* <Table dataSource={holidays} columns={columns} /> */}
</>
        </Row>

        <>
          {loading ? (
            <div className="overlay">
              <HolidayLoaderLayout screenLoaderText="Updating Data..." />
            </div>
          ) : (
            <div
              style={{
                margin: "40px 10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Badge.Ribbon
                text={`Holiday List ${currentYear}`}
                color="rgb(0, 176, 240)"
              >
                <Table
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  pagination={pagination}
                />
              </Badge.Ribbon>
            </div>

          )}
        </>

      </div>


      <Modal
        title="Edit Holiday Name"
        open={isModalVisible}
        onOk={handleSave}
        okButtonProps={{ style: { background: "rgb(0,176,240)" } }}

        onCancel={() => setIsModalVisible(false)}
        centered
      >
        <Input
          placeholder="Name"
          value={holidayName}
          onChange={(e) => setHolidayName(e.target.value)}
          style={{ margin: "8px" }}
        />
      </Modal>

      <>
        <Modal
          title="Holiday Addition Successful"
          open={showSuccessModal}
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { background: "rgb(0,176,240)" } }}

          onOk={() => setShowSuccessModal(false)}
          okText="OK"
        >
          <p>Holiday has been successfully added!</p>
        </Modal>
      </>
      <>
        <Modal
          title="Holiday Deletion Successful"
          open={successModalOnDelete}
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { background: "rgb(0,176,240)" } }}

          onOk={() => setSuccessModalOnDelete(false)}
          okText="OK"
        >
          <p>Holiday has been successfully deleted!</p>
        </Modal>
      </>
    </>
  );
};

export default HolidayListLayout;
