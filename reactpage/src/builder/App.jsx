import { useState, useEffect } from "react";
import Navbar from "../resources/navbar";
import { getInitialFundID } from "../resources/functions";
import Builder from "./Builder";

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
      <br />
      <br />
      <br />
      <Builder fundID={fundID} setFundID={setFundID} />
    </>
  );
}
