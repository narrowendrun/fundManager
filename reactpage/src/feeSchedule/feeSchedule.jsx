import { useEffect, useState } from "react";
import GraphOutput from "./GraphOutput";
import { postQuery, querier, updateRawData } from "../resources/functions";
export default function FeeScheduleGraphs({ fundID }) {
  const [allData, setData] = useState({
    fee_schedule: {
      rawData: [],
      dataset: {
        fund_id: [],
        date: [],
        capitalbalance: [],
        asset_management_fee: [],
        acquisition_price: [],
        acquisition_fee: [],
        total_fee: [],
      },
    },
  });
  useEffect(() => {
    Object.keys(allData).forEach((table) => {
      postQuery(querier(table, fundID), (data) =>
        updateRawData(table, data, setData)
      );
    });
  }, [fundID]);
  return (
    <>
      <GraphOutput fsDataset={allData.fee_schedule.dataset} />
    </>
  );
}
