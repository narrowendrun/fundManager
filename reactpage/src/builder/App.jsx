import { useState } from "react";
import Navbar from "../resources/navbar";
import { getInitialFundID } from "../resources/functions";

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
      <div className="container">
        <center>
          <h3>BUILDER</h3>
        </center>
      </div>
    </>
  );
}
