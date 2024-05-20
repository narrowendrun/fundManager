import Navbar from "../navbar";
import FeeScheduleGraphs from "./feeSchedule";

export default function App() {
  const fundID = 1;
  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container">
        <FeeScheduleGraphs fundID={fundID} />
      </div>
    </>
  );
}
