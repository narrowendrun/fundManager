import { useEffect, useState } from "react";
import Navbar from "../navbar";
import CapitalSchedule from "./capitalSchedule";
export default function App() {
  const [fundID, setFundID] = useState(1);
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <CapitalSchedule fundID={fundID} />
    </>
  );
}
