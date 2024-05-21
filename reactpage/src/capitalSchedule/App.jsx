import { useState } from "react";
import Navbar from "../resources/navbar";
import CapitalSchedule from "./capitalSchedule";
import { getInitialFundID } from "../resources/functions";
export default function App() {
  const [fundID, setFundID] = useState(getInitialFundID());
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <CapitalSchedule fundID={fundID} />
    </>
  );
}
