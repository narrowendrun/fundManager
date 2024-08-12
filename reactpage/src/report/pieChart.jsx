import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ dbData }) => {
  const data = {
    labels: ["Sold", "Remaining"],
    datasets: [
      {
        label: "Investment Distribution",
        data: [dbData.investment_sold, dbData.investment_hold],
        backgroundColor: ["blue", "red"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="pieChartGrid">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
