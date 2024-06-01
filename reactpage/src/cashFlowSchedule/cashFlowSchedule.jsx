import { useEffect, useState } from "react";
import GraphOutput from "./GraphOutput";
import { postQuery, querier, updateRawData } from "../resources/functions";
export default function CashFlowGraphs({ fundID }) {
  const [allData, setData] = useState({
    cashflow_schedule: {
      rawData: [],
      dataset: {
        fund_id: [],
        date: [],
        liquidation_proceeds: [],
        total_p_i_income: [],
        total_investment: [],
        net_proceeds: [],
      },
    },
  });
  useEffect(() => {
    Object.keys(allData).forEach((table) => {
      postQuery(
        {
          query: `SELECT * FROM cashflow_schedule WHERE (liquidation_proceeds >0 OR total_p_i_income>0) AND fund_id=${fundID} ORDER BY date`,
        },
        (data) => updateRawData(table, data, setData)
      );
    });
  }, [fundID]);
  console.log("dataset :", allData.cashflow_schedule);
  return (
    <>
      <GraphOutput CFdataset={allData.cashflow_schedule.dataset} />
    </>
  );
}
