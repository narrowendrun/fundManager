import { useState } from "react";
import Navbar from "../resources/navbar";
import { getInitialFundID } from "../resources/functions";
import Builder from "./Builder";

export default function App() {
  const [fundID, setFundID] = useState(getInitialFundID());
  return (
    <>
      <Navbar fundID={fundID} setFundID={setFundID} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Builder />
    </>
  );
}
