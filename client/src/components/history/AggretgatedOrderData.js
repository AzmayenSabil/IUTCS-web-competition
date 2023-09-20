import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";

export default function AggretgatedOrderData() {
  const [totalBreakFastOrdered, setTotalBreakFastOrdered] = useState(0);
  const [totalLunchOrdered, setTotalLunchOrdered] = useState(0);
  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/order/total-orders/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              page: 1,
            },
          }
        );

        const { data } = response;
        setTotalBreakFastOrdered(
          data.data.lunchAndBreakfastOrderCount[0].total_breakfast
        );
        setTotalLunchOrdered(
          data.data.lunchAndBreakfastOrderCount[0].total_lunch
        );
      } catch (error) {
        console.log(error);
        // Handle error state or display an error message
      }
    };

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-10">
          <div className="card w-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <i
                  className="fa fa-shopping-cart"
                  style={{ color: "rgb(0, 176, 224)" }}
                ></i>
                &nbsp; Total Ordered:{" "}
                {parseInt(totalBreakFastOrdered) + parseInt(totalLunchOrdered)}
              </h5>
              <div className="row">
                <div className="col-md-12">
                  <hr />
                  <p className="card-text">
                    Breakfast Ordered: {totalBreakFastOrdered}{" "}
                    &nbsp;|&nbsp;&nbsp;Lunch Ordered: {totalLunchOrdered}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
