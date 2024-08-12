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

export default function GraphModule({ options, title, data }) {
  return (
    <>
      <div className="container">
        <div className="theGraph">
          <Line data={data} options={options} />
        </div>
      </div>
    </>
  );
}
