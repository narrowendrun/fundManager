import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropzone() {
  const [returnFile, setReturnFile] = useState(0);
  const [deploymentFile, setDeploymentFile] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [returnUploadStatus, setReturnUploadStatus] = useState(500);
  const [returnFileResult, setReturnFileResult] = useState("");
  const [deploymentUploadStatus, setDeploymentUploadStatus] = useState(500);
  const [deploymentFileResult, setDeploymentFileResult] = useState("");
  const [outstandingBalanceStatus, setOutstandingBalanceStatus] = useState(500);
  const [outstandingBalanceResult, setOutstandingBalanceResult] = useState("");
  const [costOfCapitalStatus, setCostOfCapitalStatus] = useState(500);
  const [costOfCapitalResult, setCostOfCapitalResult] = useState("");
  const [cashFlowStatus, setCashFlowStatus] = useState(500);
  const [cashFlowResult, setCashFlowResult] = useState("");
  const [feeScheduleStatus, setFeeScheduleStatus] = useState(500);
  const [feeScheduleResult, setFeeScheduleResult] = useState("");

  const [dropStyle, setDropStyle] = useState({
    backgroundColor: "white",
    padding: "5%",
    border: "1px dashed black",
    borderRadius: "15px",
    textAlign: "center",
  });
  function display(status) {
    let style = { ...dropStyle };
    if (status == "success1") {
      style.backgroundColor = "lightyellow";
    } else if (status == "success2") {
      style.backgroundColor = "lightgreen";
    } else if (status == "fail") {
      style.backgroundColor = "red";
    } else if (status == "warn") {
      style.backgroundColor = "yellow";
    } else if (status == "default") {
      style.backgroundColor = "white";
    }
    setDropStyle(style);
  }
  function executeSqlFile(file) {
    const requestData = { sql_file_path: file };
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      redirect: "follow",
    };
    fetch("/api/runsql", requestOptions)
      .then((response) => {
        console.log("file:", file, "status:", response.status);
        if (file === "capitaloutstandingbalance.sql") {
          setOutstandingBalanceStatus(response.status);
        } else if (file === "costofcapital.sql") {
          setCostOfCapitalStatus(response.status);
        } else if (file === "cashflow_schedule.sql") {
          setCashFlowStatus(response.status);
        } else if (file === "fee_schedule.sql") {
          setFeeScheduleStatus(response.status);
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
        const parsedResult = JSON.parse(result);
        if (file === "capitaloutstandingbalance.sql") {
          setOutstandingBalanceResult(parsedResult.output);
        } else if (file === "costofcapital.sql") {
          setCostOfCapitalResult(parsedResult.output);
        } else if (file === "cashflow_schedule.sql") {
          setCashFlowResult(parsedResult.output);
        } else if (file === "fee_schedule.sql") {
          setFeeScheduleResult(parsedResult.output);
        }
      })
      .catch((error) => console.log("error", error));
  }
  function uploadFile(file, table) {
    const formData = new FormData();
    formData.append("table_name", table);
    formData.append("file", file);
    const myHeaders = new Headers();
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    fetch("/api/upload", requestOptions)
      .then((response) => {
        if (table === "capitalreturnschedule") {
          setReturnUploadStatus(response.status);
        } else if (table === "capitaldeploymentschedule") {
          setDeploymentUploadStatus(response.status);
        }
        return response.text();
      })
      .then((result) => {
        console.log("result:", result);
        if (table === "capitalreturnschedule") {
          setReturnFileResult(result);
        } else if (table === "capitaldeploymentschedule") {
          setDeploymentFileResult(result);
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }
  useEffect(() => {
    if (returnUploadStatus === 200 && deploymentUploadStatus === 200) {
      executeSqlFile("capitaloutstandingbalance.sql");
    }
  }, [returnUploadStatus, deploymentUploadStatus]);

  useEffect(() => {
    console.log("outstandingStatus:", outstandingBalanceStatus);
    if (outstandingBalanceStatus === 200) {
      executeSqlFile("costofcapital.sql");
    }
  }, [outstandingBalanceStatus]);
  useEffect(() => {
    console.log("costofcapital:", costOfCapitalStatus);
    if (costOfCapitalStatus === 200) {
      executeSqlFile("cashflow_schedule.sql");
    }
  }, [costOfCapitalStatus]);
  useEffect(() => {
    console.log("cashflowschedule:", cashFlowStatus);
    if (cashFlowStatus === 200) {
      executeSqlFile("fee_schedule.sql");
    }
  }, [cashFlowStatus]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      let newUploadedFiles = [...uploadedFiles];
      for (let i = 0; i < acceptedFiles.length; i++) {
        if (
          acceptedFiles[i].name == "capitalreturnschedule.json" &&
          returnFile == 0
        ) {
          setReturnFile(1);
          setErrorMessage("");
          console.log("received returnschedule file");
          uploadedFiles.push(acceptedFiles[i].name);
          newUploadedFiles.push({
            table_name: acceptedFiles[i].name.split(".")[0],
            file: acceptedFiles[i],
          });
        } else if (
          acceptedFiles[i].name == "capitaldeploymentschedule.json" &&
          deploymentFile == 0
        ) {
          setErrorMessage("");
          setDeploymentFile(1);
          console.log("received deploymentschedule file");
          uploadedFiles.push(acceptedFiles[i].name);
          newUploadedFiles.push({
            table_name: acceptedFiles[i].name.split(".")[0],
            file: acceptedFiles[i],
          });
        } else {
          if (returnFile == 0 && deploymentFile == 0) {
            setErrorMessage("error : please check file names");
          } else {
            setErrorMessage(
              `already uploaded ${uploadedFiles
                .map((i) => i.file.name)
                .join(", ")}`
            );
          }
          return;
        }
      }
      setUploadedFiles(newUploadedFiles);
    },
    [returnFile, deploymentFile, uploadedFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  useEffect(() => {
    if (errorMessage !== "" && uploadedFiles.length == 2) {
      display("warn");
    } else if (errorMessage != "") {
      display("fail");
    } else if (
      (returnFile == 1 && deploymentFile == 0) ||
      (returnFile == 0 && deploymentFile == 1)
    ) {
      display("success1");
    } else if (returnFile == 1 && deploymentFile == 1) {
      display("success2");
    } else display("default");
  }, [uploadedFiles, returnFile, deploymentFile, errorMessage]);
  return (
    <>
      <br />
      <div
        className="uploadContainer container"
        style={{ background: "white", padding: "2%", borderRadius: "15px" }}
      >
        <div {...getRootProps()} style={dropStyle}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drop your files here</p>
          )}
          <p>{errorMessage != "" ? errorMessage : ""}</p>
          <p>
            {returnFile == 1 || deploymentFile == 1
              ? `files ready to upload : ${uploadedFiles
                  .map((i) => i.file.name)
                  .join(", ")}`
              : ""}
          </p>
          <div
            className="container"
            style={{
              border: "1px solid black",
              borderRadius: "15px",
              textAlign: "left",
              background: "antiquewhite",
              padding: "2%",
              whiteSpace: "pre-line",
              display: `${
                deploymentFileResult != "" &&
                returnFileResult != "" &&
                outstandingBalanceResult != "" &&
                costOfCapitalResult != ""
                  ? "block"
                  : "none"
              }`,
              height: "30vh",
              overflow: "scroll",
            }}
          >
            <p>{deploymentFileResult}</p>
            <p>{returnFileResult}</p>
            <p>capitaloutstandingbalance :</p>
            <p>{outstandingBalanceResult}</p>
            <p>costofcapital :</p>
            <p>{costOfCapitalResult}</p>
            <p>cashflow :</p>
            <p>{cashFlowResult}</p>
            <p>feeschedule :</p>
            <p>{feeScheduleResult}</p>
          </div>
        </div>
        <br />
        <div
          className={`container btn btn-primary ${
            returnFile === 1 && deploymentFile === 1 ? "" : "disabled"
          }`}
          onClick={() =>
            uploadedFiles.map((item) => uploadFile(item.file, item.table_name))
          }
        >
          update database
        </div>
      </div>
    </>
  );
}
