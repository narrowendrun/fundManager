import Navbar from "../navbar";
import CapitalSchedule from "./capitalSchedule";
export default function App() {
  const fundID = 1;
  return (
    <>
      <Navbar />
      <CapitalSchedule fundID={fundID} />
    </>
  );
}
