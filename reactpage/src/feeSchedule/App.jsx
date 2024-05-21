import Navbar from "../navbar";
import FeeScheduleGraphs from "./feeSchedule";
import { useState } from "react";
export default function App() {
  const [fundID, setFundID] = useState(1);
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <div className="container">
        <FeeScheduleGraphs fundID={fundID} />
      </div>
    </>
  );
}
