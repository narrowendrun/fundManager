import GraphModule from "./graphModule";
export default function GraphOutput({ Dataset, title }) {
  let values = {
    debt: {
      labels: Dataset.date,
      datasets: [
        {
          label: "Senior",
          data: Dataset.senior,
          backgroundColor: "blue",
          borderColor: "blue",
          pointBorderColor: "blue",
          tension: 0.1,
        },
        {
          label: "Mezz",
          data: Dataset.mezz,
          backgroundColor: "red",
          borderColor: "red",
          pointBorderColor: "red",
          tension: 0.1,
        },
        {
          label: "Junior",
          data: Dataset.junior,
          backgroundColor: "orange",
          borderColor: "orange",
          pointBorderColor: "orange",
          tension: 0.1,
        },
      ],
    },
    equity: {
      labels: Dataset.date,
      datasets: [
        {
          label: "classA",
          data: Dataset.classa,
          backgroundColor: "black",
          borderColor: "black",
          pointBorderColor: "black",
          tension: 0.1,
        },
        {
          label: "classB",
          data: Dataset.classb,
          backgroundColor: "grey",
          borderColor: "grey",
          pointBorderColor: "grey",
          tension: 0.1,
        },
      ],
    },
  };
  if (Dataset.total !== undefined) {
    values.equity.datasets.push({
      label: "total",
      data: Dataset.total,
      backgroundColor: "red",
      borderColor: "red",
      pointBorderColor: "red",
      tension: 0.1,
    });
  }
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
      <div className="graphSpace">
        <GraphModule
          options={options}
          title={title}
          debt={values.debt}
          equity={values.equity}
        />
      </div>
    </>
  );
}
