import Navbar from "../navbar";
import FeeScheduleGraphs from "./fsGraphs";

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
