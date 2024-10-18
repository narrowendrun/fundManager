import Navbar from "../resources/navbar";
import { useEffect, useState } from "react";
import { getInitialFundID, postQuery } from "../resources/functions";
import BuildWaterfall from "./buildWaterfall";
export default function App() {
  const [fundID, setFundID] = useState(getInitialFundID());

  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <BuildWaterfall fundID={fundID} />
    </>
  );
}
