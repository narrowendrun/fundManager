import GraphModule from "./graphModule";
export default function GraphOutput({
  CDdataset,
  CRdataset,
  COBdataset,
  COCdataset,
}) {
  const CDdebt = {
    labels: CDdataset.date,
    datasets: [
      {
        label: "Senior",
        data: CDdataset.senior,
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "Mezz",
        data: CDdataset.mezz,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "Junior",
        data: CDdataset.junior,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  const CDequity = {
    labels: CDdataset.date,
    datasets: [
      {
        label: "classA",
        data: CDdataset.classa,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "classB",
        data: CDdataset.classb,
        backgroundColor: "grey",
        borderColor: "grey",
        pointBorderColor: "grey",
        tension: 0.1,
      },
    ],
  };
  const CRdebt = {
    labels: CRdataset.date,
    datasets: [
      {
        label: "Senior",
        data: CRdataset.senior,
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "Mezz",
        data: CRdataset.mezz,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "Junior",
        data: CRdataset.junior,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  const CRequity = {
    labels: CRdataset.date,
    datasets: [
      {
        label: "classA",
        data: CRdataset.classa,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "classB",
        data: CRdataset.classb,
        backgroundColor: "grey",
        borderColor: "grey",
        pointBorderColor: "grey",
        tension: 0.1,
      },
    ],
  };
  const COBdebt = {
    labels: COBdataset.date,
    datasets: [
      {
        label: "Senior",
        data: COBdataset.senior,
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "Mezz",
        data: COBdataset.mezz,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "Junior",
        data: COBdataset.junior,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  const COBequity = {
    labels: COBdataset.date,
    datasets: [
      {
        label: "classA",
        data: COBdataset.classa,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "classB",
        data: COBdataset.classb,
        backgroundColor: "grey",
        borderColor: "grey",
        pointBorderColor: "grey",
        tension: 0.1,
      },
    ],
  };
  const COCdebt = {
    labels: COCdataset.date,
    datasets: [
      {
        label: "Senior",
        data: COCdataset.senior,
        backgroundColor: "blue",
        borderColor: "blue",
        pointBorderColor: "blue",
        tension: 0.1,
      },
      {
        label: "Mezz",
        data: COCdataset.mezz,
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "red",
        tension: 0.1,
      },
      {
        label: "Junior",
        data: COCdataset.junior,
        backgroundColor: "orange",
        borderColor: "orange",
        pointBorderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  const COCequity = {
    labels: COCdataset.date,
    datasets: [
      {
        label: "classA",
        data: COCdataset.classa,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "black",
        tension: 0.1,
      },
      {
        label: "classB",
        data: COCdataset.classb,
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
      <div className="graphSpace">
        <GraphModule
          options={options}
          title={"Capital Deployment"}
          debt={CDdebt}
          equity={CDequity}
        />
        <GraphModule
          options={options}
          title={"Capital Returns"}
          debt={CRdebt}
          equity={CRequity}
        />
        <GraphModule
          options={options}
          title={"Capital Outstanding Balance"}
          debt={COBdebt}
          equity={COBequity}
        />
        <GraphModule
          options={options}
          title={"Cost of Captial"}
          debt={COCdebt}
          equity={COCequity}
        />
      </div>
    </>
  );
}
