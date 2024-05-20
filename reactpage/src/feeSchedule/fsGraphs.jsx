import { useEffect, useState } from "react";
import GraphOutput from "./GraphOutput";

export default function FeeScheduleGraphs({ fundID }) {
  const [fsRawData, setFSrawData] = useState([]);
  const [fsDataset, setFSdataset] = useState({
    fund_id: [],
    date: [],
    capitalbalance: [],
    asset_management_fee: [],
    acquisition_price: [],
    acquisition_fee: [],
    total_fee: [],
  });
  function postQuery(payload, action) {
    fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Convert postData to JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse response body as JSON
      })
      .then((data) => {
        // Work with JSON data here
        action(data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    const FSData = {
      query: `SELECT * FROM fee_schedule WHERE fund_id=${fundID}`,
    };
    postQuery(FSData, setFSrawData);
  }, []);
  useEffect(() => {
    setFSdataset((prevFSdataset) => {
      const newFSdataset = {
        ...prevFSdataset,
        fund_id: fsRawData.map((item) => item.fund_id),
        date: fsRawData.map((item) => item.date),
        capitalbalance: fsRawData.map((item) => item.capitalbalance),
        asset_management_fee: fsRawData.map(
          (item) => item.asset_management_fee
        ),
        acquisition_price: fsRawData.map((item) => item.acquisition_price),
        acquisition_fee: fsRawData.map((item) => item.acquisition_fee),
        total_fee: fsRawData.map((item) => item.total_fee),
      };
      return newFSdataset;
    });
  }, [fsRawData]);
  return (
    <>
      <GraphOutput fsDataset={fsDataset} />
    </>
  );
}
