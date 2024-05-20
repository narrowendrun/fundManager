import { useEffect, useState } from "react";
import GraphOutput from "./graphs";
import FundDashboard from "./fundDashboard";
import Navbar from "../navbar";
import { FundProvider, useFund } from "../FundContext";
export default function App() {
  const fundID = 1;
  const [cobRawData, setCOBRawData] = useState([]);
  const [crRawData, setCRrawData] = useState([]);
  const [cdRawData, setCDrawData] = useState([]);
  const [cocRawData, setCOCrawData] = useState([]);
  const [fundData, setFundData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [equityData, setEquityData] = useState([]);
  const [CDdataset, setCDdataset] = useState({
    date: [],
    senior: [],
    mezz: [],
    junior: [],
    classa: [],
    classb: [],
  });
  const [CRdataset, setCRdataset] = useState({
    date: [],
    senior: [],
    mezz: [],
    junior: [],
    classa: [],
    classb: [],
  });
  const [COBdataset, setCOBdataset] = useState({
    date: [],
    senior: [],
    mezz: [],
    junior: [],
    classa: [],
    classb: [],
  });
  const [COCdataset, setCOCdataset] = useState({
    date: [],
    senior: [],
    mezz: [],
    junior: [],
    classa: [],
    classb: [],
    total: [],
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
    const CDdata = {
      query: `SELECT * FROM capitaldeploymentschedule WHERE fund_id = ${fundID}`,
    };
    const CRdata = {
      query: `SELECT * FROM capitalreturnschedule WHERE fund_id = ${fundID}`,
    };
    const COCdata = {
      query: `SELECT * FROM costofcapital WHERE fund_id = ${fundID}`,
    };
    const postData = {
      query: `SELECT * FROM capitaloutstandingbalance WHERE fund_id = ${fundID}`,
    };
    const postData2 = {
      query: `SELECT * FROM fund_information WHERE fund_id = ${fundID}`,
    };
    const postData3 = {
      query: `SELECT * FROM  debt_structure WHERE fund_id = ${fundID}`,
    };
    const postData4 = {
      query: `SELECT * FROM  equity_structure WHERE fund_id = ${fundID}`,
    };
    postQuery(CDdata, setCDrawData);
    postQuery(CRdata, setCRrawData);
    postQuery(COCdata, setCOCrawData);
    postQuery(postData, setCOBRawData);
    postQuery(postData2, setFundData);
    postQuery(postData3, setDebtData);
    postQuery(postData4, setEquityData);
  }, []);

  function updateDataset(rawData, setDataset) {
    setDataset((prevDataset) => ({
      ...prevDataset,
      date: rawData.map((item) => item.date),
      senior: rawData.map((item) => item.senior),
      mezz: rawData.map((item) => item.mezz),
      junior: rawData.map((item) => item.junior),
      classa: rawData.map((item) => item.classa),
      classb: rawData.map((item) => item.classb),
    }));
  }
  useEffect(() => {
    console.log("change");
    updateDataset(cdRawData, setCDdataset);
  }, [cdRawData]);
  useEffect(() => {
    console.log("change");
    updateDataset(crRawData, setCRdataset);
  }, [crRawData]);
  useEffect(() => {
    console.log("change");
    updateDataset(cobRawData, setCOBdataset);
  }, [crRawData]);
  useEffect(() => {
    console.log("change");
    updateDataset(cocRawData, setCOCdataset);
  }, [crRawData]);
  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col">
          <FundDashboard
            fundData={fundData}
            debtData={debtData}
            equityData={equityData}
          />
        </div>
        <div className="col">
          <GraphOutput
            CDdataset={CDdataset}
            CRdataset={CRdataset}
            COBdataset={COBdataset}
            COCdataset={COCdataset}
          />
        </div>
      </div>
    </>
  );
}
