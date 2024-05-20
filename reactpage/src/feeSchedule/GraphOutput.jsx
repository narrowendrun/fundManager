import GraphModule from "./graphModule";

export default function GraphOutput({ fsDataset }) {
  const feeschedule = {
    labels: fsDataset.date,
    datasets: [
      {
        label: "Capital Balance",
        data: fsDataset.capitalbalance,
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "Asset Management Fee",
        data: fsDataset.asset_management_fee,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "Acquisition Price",
        data: fsDataset.acquisition_price,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
      {
        label: "Acquisition Fee",
        data: fsDataset.acquisition_fee,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "Total Fee",
        data: fsDataset.total_fee,
        backgroundColor: "grey",
        borderColor: "grey",
        pointBorderColor: "grey",
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
        title={"Fee Schedule"}
        options={options}
        debt={feeschedule}
      />
    </>
  );
}
