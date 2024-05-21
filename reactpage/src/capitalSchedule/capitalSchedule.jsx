import { useEffect, useState } from "react";
import GraphOutput from "./graphs";
import FundDashboard from "./fundDashboard";
import { postQuery, querier, updateRawData } from "../functions";
export default function CapitalSchedule({ fundID }) {
  const [fundData, setFundData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [equityData, setEquityData] = useState([]);
  const [allData, setData] = useState({
    capitaldeploymentschedule: {
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
          />
        </div>
        <div className="col">
          <GraphOutput
            CDdataset={allData.capitaldeploymentschedule.dataset}
            CRdataset={allData.capitalreturnschedule.dataset}
            COBdataset={allData.capitaloutstandingbalance.dataset}
            COCdataset={allData.costofcapital.dataset}
          />
        </div>
      </div>
    </>
  );
}
