import GraphModule from "./graphModule";

export default function GraphOutput({ CFdataset }) {
  const cashflowschedule = {
    labels: CFdataset.date,
    datasets: [
      {
        label: "Liquidation Proceeds",
        data: CFdataset.liquidation_proceeds,
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "P&I income",
        data: CFdataset.total_p_i_income,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "Total Investment",
        data: CFdataset.total_investment,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "Net Proceeds",
        data: CFdataset.net_proceeds,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      y: {},
    },
  };
  return (
    <>
      <GraphModule
        title={"Cash Flow Schedule"}
        options={options}
        debt={cashflowschedule}
      />
    </>
  );
}
