import { useEffect, useState } from "react";
import GraphOutput from "./GraphOutput";

export default function CashFlowGraphs({ fundID }) {
  const [cfRawData, setCFrawData] = useState([]);
  const [CFdataset, setCFdataset] = useState({
    fund_id: [],
    month: [],
    total_investment: [],
    total_liq_price: [],
    net_proceeds: [],
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
    const CFData = {
      query: `SELECT * FROM cashflow_schedule WHERE fund_id=${fundID}`,
    };
    postQuery(CFData, setCFrawData);
  }, []);
  useEffect(() => {
    setCFdataset((prevCFdataset) => {
      const newCFdataset = {
        ...prevCFdataset,
        fund_id: cfRawData.map((item) => item.fund_id),
        date: cfRawData.map((item) => item.date),
        liquidation_proceeds: cfRawData.map(
          (item) => item.liquidation_proceeds
        ),
        total_p_i_income: cfRawData.map((item) => item.total_p_i_income),
        total_investment: cfRawData.map((item) => item.total_investment),
        net_proceeds: cfRawData.map((item) => item.net_proceeds),
      };
      return newCFdataset;
    });
  }, [cfRawData]);
  console.log(CFdataset);
  return (
    <>
      <GraphOutput CFdataset={CFdataset} />
    </>
  );
}
