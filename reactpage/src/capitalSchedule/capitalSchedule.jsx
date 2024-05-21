import { useEffect, useState } from "react";
import GraphOutput from "./graphs";
import FundDashboard from "./fundDashboard";
import { postQuery, querier, updateRawData } from "../resources/functions";
export default function CapitalSchedule({ fundID }) {
  const [fundData, setFundData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [equityData, setEquityData] = useState([]);
  const [allData, setData] = useState({
    capitaldeploymentschedule: {
      title: "Capital Deployment Schedule",
      rawData: [],
      dataset: {
        date: [],
        senior: [],
        mezz: [],
        junior: [],
        classa: [],
        classb: [],
      },
    },
    capitalreturnschedule: {
      title: "Capital Return Schedule",
      rawData: [],
      dataset: {
        date: [],
        senior: [],
        mezz: [],
        junior: [],
        classa: [],
        classb: [],
      },
    },
    capitaloutstandingbalance: {
      title: "Capital Outstanding Balance",
      rawData: [],
      dataset: {
        date: [],
        senior: [],
        mezz: [],
        junior: [],
        classa: [],
        classb: [],
      },
    },
    costofcapital: {
      title: "Cost of Capital",
      rawData: [],
      dataset: {
        date: [],
        senior: [],
        mezz: [],
        junior: [],
        classa: [],
        classb: [],
        total: [],
      },
    },
  });
  const [selection, setSelection] = useState(1);
  useEffect(() => {
    postQuery(querier("fund_information", fundID), setFundData);
    postQuery(querier("debt_structure", fundID), setDebtData);
    postQuery(querier("equity_structure", fundID), setEquityData);
    Object.keys(allData).forEach((table) => {
      postQuery(querier(table, fundID), (data) =>
        updateRawData(table, data, setData)
      );
    });
  }, [fundID]);
  return (
    <>
      <div className="row">
        <div className="col">
          <FundDashboard
            fundData={fundData}
            debtData={debtData}
            equityData={equityData}
            selection={selection}
            setSelection={setSelection}
            chartName={allData[Object.keys(allData)[selection]].title}
          />
        </div>
        <div className="col">
          <GraphOutput
            Dataset={allData[Object.keys(allData)[selection]].dataset}
            title={allData[Object.keys(allData)[selection]].title}
          />
        </div>
      </div>
    </>
  );
}
