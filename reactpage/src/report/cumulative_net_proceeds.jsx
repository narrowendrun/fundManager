import React, { useEffect, useState } from "react";
import "../style/cumulative.css"; // Assuming this imports the styles for the graph
import { postQuery } from "../resources/functions";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CumulativeProceeds({ fundID }) {
  const [dbData, setDbData] = useState({
    date: [],
    cumulative_net_proceeds: [],
  });

  useEffect(() => {
    postQuery(
      {
        query: `SELECT date,cumulative_net_proceeds FROM cumulative_net_proceeds WHERE fund_id = ${fundID} ORDER BY date`,
      },
      (response) => {
        const date = [];
        const cumulativeNetProceeds = [];

        response.forEach((item) => {
          date.push(item.date); // Assuming `date` is a valid date format for Chart.js
          cumulativeNetProceeds.push(item.cumulative_net_proceeds);
        });

        setDbData({
          date: date,
          cumulative_net_proceeds: cumulativeNetProceeds,
        });
      }
    );
  }, [fundID]); // Update useEffect only when fundID changes

  const chartData = {
    labels: dbData.date,
    datasets: [
      {
        label: "Cumulative Net Proceeds",
        data: dbData.cumulative_net_proceeds,
        fill: false, // Adjust for line or filled area
        backgroundColor: "white", // Example color, adjust as needed
        borderColor: "black", // Example color, adjust as needed
        pointRadius: 5, // Adjust point size as desired
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // Allow the chart to resize based on the container
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cumulative Net Proceeds",
        },
      },
    },
    responsive: true, // Make the chart responsive
  };

  return (
    <div className="cumulativeProceedsWrapper">
      <h2>Cumulative Net Proceeds</h2>
      <div className="cumulativeProceeds">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
