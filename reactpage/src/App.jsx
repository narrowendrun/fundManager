import { useState } from "react";
import FileDropzone from "./dropzone";
import Navbar from "./navbar";
import { getInitialFundID } from "./functions";

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
        <br />
        <br />
        <FileDropzone />
      </div>
    </>
  );
}
