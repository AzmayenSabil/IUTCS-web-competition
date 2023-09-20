import React, { useState, useEffect, useMemo } from "react";
import CheckAuth from "../../authentication/common/hooks/CheckAuth";
import { Pagination, Card, Col, Row, Avatar, Empty, Space, Tooltip, Badge } from 'antd';
import clientProfileImageIcon from "../../../assets/clientProfileImage.png"
import "../../../styles/HomeTabSwitchingStyle.css";
import axios from "axios";
import { debounce } from "lodash";
import EmployeeListingLoaderLayout from "../../screenLoader/EmployeeListingLoaderLayout"
import Search from "antd/es/input/Search";


export default function ExpiredEmployeeLayout() {
  CheckAuth();

  const [expiredEmployeeInformation, setExpiredEmployeeInformation] = useState([]);
  const [totalNumberOfExpiredUsers, setTotalNumberOfExpiredUsers] = useState(0);
  const [expiredEmployeeInformationOnSearch, setExpiredEmployeeInformationOnSearch] = useState([]);
  const [totalNumberOfExpiredUsersOnSearch, setTotalNumberOfExpiredUsersOnSearch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageForSearch, setCurrentPageForSearch] = useState(1);
  const [loggedInUserEmployeeID, setLoggedInUserEmployeeID] = useState("")

  const itemsPerPage = 6; // Number of items to display per page
  const itemsPerPageForSearchingResult = 6
  const [loading, setLoading] = useState(false)
  const searchInputTooltipText = "Search by Name, Employee-Id, Gender, Type, Department or Designation"
  const base_url = process.env.REACT_APP_BASE_URL;
  const [arrow, setArrow] = useState('Show');
  const mergedArrow = useMemo(() => {
    if (arrow === 'Hide') {
      return false;
    }
    if (arrow === 'Show') {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/employee-information/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: currentPage,
              limit: itemsPerPage,
            },
          }
        );

        const { data } = response;
        // console.log(data.data.total_number_of_expired_users[0].total_users)
        setTotalNumberOfExpiredUsers(data.data.total_number_of_expired_users[0].total_users)
        setExpiredEmployeeInformation(data.data.expiredEployeesInformationList);
        setLoggedInUserEmployeeID(data.data.loggedInUserEmployeeID.employee_id)

      } catch (error) {
        console.log(error);

      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    const debouncedFetchData = debounce(fetchData, 200);
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      handleSearchResults();
    } else {
      setExpiredEmployeeInformationOnSearch([]);
      setTotalNumberOfExpiredUsersOnSearch(0);
    }
  }, [currentPageForSearch, searchQuery]);

  const handleSearchResults = async () => {


    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const user_id = sessionStorage.getItem("userData");
      const response = await axios.get(
        `${base_url}/api/v1/client/search/expired-employees`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            searchQuery,
            page: currentPageForSearch,
            limit: itemsPerPageForSearchingResult,
          },

        }
      );
      //console.log(response);
      const { data } = response;
      setExpiredEmployeeInformationOnSearch(data.data.expiredEmployeesSearchResult)
      setTotalNumberOfExpiredUsersOnSearch(data.data.totalExpiredEmployeeOnSearchResult[0].total_users)
      setLoggedInUserEmployeeID(data.data.loggedInUserEmployeeID.employee_id)


    } catch (error) {
      console.error("Error fetching search results on active employees :", error);
    }
  };

  const handlePageChange = (page) => {

    setCurrentPage(page);
  };
  const handlePageChangeOnSearchResult = (page) => {

    setCurrentPageForSearch(page);
  };
  const handleSearch = (event) => {

    const value = event;
    setSearchQuery(value)
    // console.log(value);
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Space direction="vertical" >
          <Tooltip
            placement="top"
            title={searchInputTooltipText}
            color="#2db7f5"
            arrow={mergedArrow}
            mouseLeaveDelay={0.7}
            overlayStyle={{
              fontSize: "12px",
              maxWidth: "250px",
              height: "50px",
            }}

          >
            <Search
              placeholder="Type Name, EmployeeId, Gender, Type Department or Designation..."
              allowClear
              onSearch={handleSearch}
              style={{
                width: 235,
                marginBottom: '10px',
                fontSize: "9px"
              }}
            // className="employee-search-text"

            />
          </Tooltip>
        </Space>
      </div>

      {loading ? (
        <EmployeeListingLoaderLayout screenLoaderText="Loading Data..." />
      ) : (
        <>
          {searchQuery ? (
            <>
              {totalNumberOfExpiredUsersOnSearch === 0 ? (
                <div style={{ textAlign: "center", marginTop: "140px" }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                    description={<p style={{ color: "#ababab" }}>No Active Employees found!</p>}
                  />
                </div>
              ) : (
                <div className="site-card-wrapper">
                  <Row gutter={[16, 16]}>
                    {expiredEmployeeInformationOnSearch.map((employee, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        {employee.employee_id === loggedInUserEmployeeID ? (
                          <Badge.Ribbon text="My Profile" size="small" color="rgb(0,176,240)">
                            <Card bordered={true} className="custom-card" size="small" style={{ fontSize: "10px" }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  {employee.photo === null ? (
                                    <img src={clientProfileImageIcon} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                                  ) : (
                                    <img src={`${base_url}/client/${employee.user_id}/` + employee.photo} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                                  )}
                                </div>
                                <div className="employee-info" style={{ flex: 2, marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                                  {employee.name ? (
                                    <p><strong>Name :</strong> {employee.name}</p>
                                  ) : (
                                    <p><strong>Name :</strong> Not Updated</p>
                                  )}
                                  {employee.employee_id ? (
                                    <p><strong>Employee ID :</strong> {employee.employee_id}</p>
                                  ) : (
                                    <p><strong>Employee ID :</strong> Not Updated</p>
                                  )}
                                  {employee.email ? (
                                    <p><strong>Email :</strong> {employee.email}</p>
                                  ) : (
                                    <p><strong>Email :</strong> Not Updated</p>
                                  )}
                                  {employee.contact ? (
                                    <p><strong>Contact :</strong> {employee.contact}</p>
                                  ) : (
                                    <p><strong>Contact :</strong> Not Updated</p>
                                  )}
                                  {employee.designation ? (
                                    <p><strong>Designation :</strong> {employee.designation}</p>
                                  ) : (
                                    <p><strong>Designation :</strong> Not Updated</p>
                                  )}
                                  {employee.type ? (
                                    <p><strong>Type :</strong> {employee.type}</p>
                                  ) : (
                                    <p><strong>Type :</strong> Not Updated</p>
                                  )}
                                  {employee.department ? (
                                    <p><strong>Department :</strong> {employee.department}</p>
                                  ) : (
                                    <p><strong>Department :</strong> Not Updated</p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </Badge.Ribbon>
                        ) : (<Card bordered={true} className="custom-card" size="small" style={{ fontSize: "10px" }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              {employee.photo === null ? (
                                <img src={clientProfileImageIcon} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                              ) : (
                                <img src={`${base_url}/client/${employee.user_id}/` + employee.photo} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                              )}
                            </div>
                            <div className="employee-info" style={{ flex: 2, marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                              {employee.name ? (
                                <p><strong>Name :</strong> {employee.name}</p>
                              ) : (
                                <p><strong>Name :</strong> Not Updated</p>
                              )}
                              {employee.employee_id ? (
                                <p><strong>Employee ID :</strong> {employee.employee_id}</p>
                              ) : (
                                <p><strong>Employee ID :</strong> Not Updated</p>
                              )}
                              {employee.email ? (
                                <p><strong>Email :</strong> {employee.email}</p>
                              ) : (
                                <p><strong>Email :</strong> Not Updated</p>
                              )}
                              {employee.contact ? (
                                <p><strong>Contact :</strong> {employee.contact}</p>
                              ) : (
                                <p><strong>Contact :</strong> Not Updated</p>
                              )}
                              {employee.designation ? (
                                <p><strong>Designation :</strong> {employee.designation}</p>
                              ) : (
                                <p><strong>Designation :</strong> Not Updated</p>
                              )}
                              {employee.type ? (
                                <p><strong>Type :</strong> {employee.type}</p>
                              ) : (
                                <p><strong>Type :</strong> Not Updated</p>
                              )}
                              {employee.department ? (
                                <p><strong>Department :</strong> {employee.department}</p>
                              ) : (
                                <p><strong>Department :</strong> Not Updated</p>
                              )}
                            </div>
                          </div>
                        </Card>)}
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              <div style={{ margin: "18px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  defaultCurrent={currentPageForSearch}
                  total={totalNumberOfExpiredUsersOnSearch}
                  pageSize={itemsPerPageForSearchingResult}
                  onChange={handlePageChangeOnSearchResult}
                />
              </div>
            </>
          ) : (
            <>
              {totalNumberOfExpiredUsers === 0 ? (
                <div style={{ textAlign: "center", marginTop: "140px" }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                    description={<p style={{ color: "#ababab" }}>No Active Employees found!</p>}
                  />
                </div>
              ) : (
                <div className="site-card-wrapper">
                  <Row gutter={[16, 16]}>
                    {expiredEmployeeInformation.map((employee, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        {employee.employee_id === loggedInUserEmployeeID ? (
                          <Badge.Ribbon text="My Profile" size="small" color="rgb(0,176,240)">
                            <Card bordered={true} className="custom-card" size="small" style={{ fontSize: "10px" }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  {employee.photo === null ? (
                                    <img src={clientProfileImageIcon} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                                  ) : (
                                    <img src={`${base_url}/client/${employee.user_id}/` + employee.photo} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                                  )}
                                </div>
                                <div className="employee-info" style={{ flex: 2, marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                                  {employee.name ? (
                                    <p><strong>Name :</strong> {employee.name}</p>
                                  ) : (
                                    <p><strong>Name :</strong> Not Updated</p>
                                  )}
                                  {employee.employee_id ? (
                                    <p><strong>Employee ID :</strong> {employee.employee_id}</p>
                                  ) : (
                                    <p><strong>Employee ID :</strong> Not Updated</p>
                                  )}
                                  {employee.email ? (
                                    <p><strong>Email :</strong> {employee.email}</p>
                                  ) : (
                                    <p><strong>Email :</strong> Not Updated</p>
                                  )}
                                  {employee.contact ? (
                                    <p><strong>Contact :</strong> {employee.contact}</p>
                                  ) : (
                                    <p><strong>Contact :</strong> Not Updated</p>
                                  )}
                                  {employee.designation ? (
                                    <p><strong>Designation :</strong> {employee.designation}</p>
                                  ) : (
                                    <p><strong>Designation :</strong> Not Updated</p>
                                  )}
                                  {employee.type ? (
                                    <p><strong>Type :</strong> {employee.type}</p>
                                  ) : (
                                    <p><strong>Type :</strong> Not Updated</p>
                                  )}
                                  {employee.department ? (
                                    <p><strong>Department :</strong> {employee.department}</p>
                                  ) : (
                                    <p><strong>Department :</strong> Not Updated</p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </Badge.Ribbon>
                        ) : (<Card bordered={true} className="custom-card" size="small" style={{ fontSize: "10px" }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              {employee.photo === null ? (
                                <img src={clientProfileImageIcon} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                              ) : (
                                <img src={`${base_url}/client/${employee.user_id}/` + employee.photo} alt="Image" style={{ maxWidth: '70%', height: 'auto' }} />
                              )}
                            </div>
                            <div className="employee-info" style={{ flex: 2, marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                              {employee.name ? (
                                <p><strong>Name :</strong> {employee.name}</p>
                              ) : (
                                <p><strong>Name :</strong> Not Updated</p>
                              )}
                              {employee.employee_id ? (
                                <p><strong>Employee ID :</strong> {employee.employee_id}</p>
                              ) : (
                                <p><strong>Employee ID :</strong> Not Updated</p>
                              )}
                              {employee.email ? (
                                <p><strong>Email :</strong> {employee.email}</p>
                              ) : (
                                <p><strong>Email :</strong> Not Updated</p>
                              )}
                              {employee.contact ? (
                                <p><strong>Contact :</strong> {employee.contact}</p>
                              ) : (
                                <p><strong>Contact :</strong> Not Updated</p>
                              )}
                              {employee.designation ? (
                                <p><strong>Designation :</strong> {employee.designation}</p>
                              ) : (
                                <p><strong>Designation :</strong> Not Updated</p>
                              )}
                              {employee.type ? (
                                <p><strong>Type :</strong> {employee.type}</p>
                              ) : (
                                <p><strong>Type :</strong> Not Updated</p>
                              )}
                              {employee.department ? (
                                <p><strong>Department :</strong> {employee.department}</p>
                              ) : (
                                <p><strong>Department :</strong> Not Updated</p>
                              )}
                            </div>
                          </div>
                        </Card>)}
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              <div style={{ margin: "18px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  defaultCurrent={currentPage}
                  total={totalNumberOfExpiredUsersOnSearch}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}