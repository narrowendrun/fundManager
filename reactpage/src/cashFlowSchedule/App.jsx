import Navbar from "../navbar";
import CashFlowGraphs from "./cfGraphs";

export default function App() {
  const fundID = 1;
  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="container">
        <CashFlowGraphs fundID={fundID} />
      </div>
    </>
  );
}
