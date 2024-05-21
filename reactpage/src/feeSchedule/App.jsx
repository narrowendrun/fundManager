import Navbar from "../navbar";
import FeeScheduleGraphs from "./feeSchedule";
import { useState } from "react";
import { getInitialFundID } from "../functions";
export default function App() {
  const [fundID, setFundID] = useState(getInitialFundID());
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <div className="container">
        <FeeScheduleGraphs fundID={fundID} />
      </div>
    </>
  );
}
