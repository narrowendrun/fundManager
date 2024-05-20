import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale, //x axis
  LinearScale, //y axis
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);
const graphStyle = {
  backgroundColor: "white",
  padding: "2%",
  borderRadius: "15px",
  boxShadow:
    "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
};
export default function GraphModule({ options, title, debt, equity }) {
  return (
    <>
      <div className="graphContainer container">
        <center>
          <h2>{title}</h2>
        </center>
        <br />
        <div className="container" style={graphStyle}>
          <h4> Debt Charts ({title})</h4>
          <Line data={debt} options={options} />
        </div>
        <br />
        <div className="container" style={graphStyle}>
          <h4> Equity Charts ({title})</h4>
          {/* <Line data={equity} options={options} /> */}
          <Bar data={equity} options={options} />
        </div>
      </div>
    </>
  );
}
