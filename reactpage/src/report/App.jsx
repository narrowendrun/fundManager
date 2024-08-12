import { useState, useEffect } from "react";
import Navbar from "../resources/navbar";
import { getInitialFundID } from "../resources/functions";
import ReportBlockWrapper from "./reportBlockWrapper";
import Snapshot from "./snapshot";
import UnitEconomics from "./unitEconomics";
import CumulativeProceeds from "./cumulative_net_proceeds";

export default function App() {
  const [fundID, setFundID] = useState(getInitialFundID());

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "scroll";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <ReportBlockWrapper fundID={fundID} />
      <CumulativeProceeds fundID={fundID} />
      <Snapshot fundID={fundID} />
      <UnitEconomics fundID={fundID} />
    </>
  );
}
