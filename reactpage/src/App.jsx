import { useState } from "react";
import FileDropzone from "./resources/dropzone";
import Navbar from "./resources/navbar";
import { getInitialFundID } from "./resources/functions";

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
