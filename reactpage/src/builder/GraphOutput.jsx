import GraphModule from "./GraphModule";

export default function GraphOutput({ cashflows }) {
  const paidGraphs = {
    labels: cashflows.date,
    datasets: [
      {
        label: "senior",
        data: cashflows["senior"],
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "mezz",
        data: cashflows.mezz,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "junior",
        data: cashflows.junior,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
      {
        label: "classa",
        data: cashflows.classa,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "classb",
        data: cashflows.classb,
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
      <GraphModule options={options} title={"cashflows"} data={paidGraphs} />
    </>
  );
}
