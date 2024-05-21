import { useEffect, useState } from "react";
import Navbar from "../navbar";
import CashFlowGraphs from "./cashFlowSchedule";
import { getInitialFundID } from "../functions";

export default function App() {
  const [fundID, setFundID] = useState(getInitialFundID());
  useEffect(() => {
    console.log(fundID);
  }, [fundID]);
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <div className="container">
        <CashFlowGraphs fundID={fundID} />
      </div>
    </>
  );
}
