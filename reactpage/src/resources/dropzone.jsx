import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import DropzoneError from "./dropzoneError";
import useLogger from "./useLogger";
import logo from "../images/Designer2.jpeg";
import RepopulateTables from "./repopulate";
export default function FileDropzone() {
  const [returnFile, setReturnFile] = useState(0);
  const [deploymentFile, setDeploymentFile] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sequenceCompleted, setSequenceCompleted] = useState(false);
  const [apiCall, setApiCall] = useState({
    reset: {
      status: 0,
      result: "",
      filename: "reset.sql",
      hasRun: false,
    },
    capitalreturnschedule: {
      status: 0,
      result: "",
      filename: "capitalreturnschedule.csv",
      hasRun: false,
    },
    capitaldeploymentschedule: {
      status: 0,
      result: "",
      filename: "capitaldeploymentschedule.csv",
      hasRun: false,
    },
    capitaloutstandingbalance: {
      status: 0,
      result: "",
      filename: "capitaloutstandingbalance.sql",
      hasRun: false,
    },
    costofcapital: {
      status: 0,
      result: "",
      filename: "costofcapital.sql",
      hasRun: false,
    },
    cashflowschedule: {
      status: 0,
      result: "",
      filename: "cashflow_schedule.sql",
      hasRun: false,
    },
    feeschedule: {
      status: 0,
      result: "",
      filename: "fee_schedule.sql",
      hasRun: false,
    },
    missingdurations: {
      status: 0,
      result: "",
      filename: "missing_durations.sql",
      hasRun: false,
    },
    summary: {
      status: 0,
      result: "",
      filename: "summary.sql",
      hasRun: false,
    },
  });
  const [dropStyle, setDropStyle] = useState({
    backgroundColor: "white",
    padding: "5%",
    border: "1px dashed black",
    borderRadius: "15px",
    textAlign: "center",
    height: "100%",
  });
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "scroll";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
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
  async function executeSqlFile(table) {
    console.log("executing", apiCall[table].filename);
    const requestData = { sql_file_path: apiCall[table].filename };
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      redirect: "follow",
    };

    if (apiCall[table].status !== 200) {
      try {
        const response = await fetch("/api/runsql", requestOptions);
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        setApiCall((prev) => {
          const newDict = { ...prev };
          newDict[table].status = response.status;
          return newDict;
        });

        if (table == "reset") {
          return new Promise((resolve) => {
            setApiCall((prev) => {
              const newDict = { ...prev };
              newDict[table].status = response.status;
              newDict[table].result = parsedResult.output;
              resolve(newDict[table].status);
              return newDict;
            });
          });
        } else {
          setApiCall((prev) => {
            const newDict = { ...prev };
            newDict[table].status = response.status;
            if (response.status === 200) {
              newDict[table].hasRun = true;
            }
            newDict[table].result = parsedResult.output;
            return newDict;
          });
        }
      } catch (error) {
        console.log("error", error);
        if (error) {
          setApiCall((prev) => {
            const newDict = { ...prev };
            // newDict[table].status = 500;
            newDict[table].hasRun = false;
            newDict[table].result = error.toString();
            return newDict;
          });
        }
      }
    }
  }

  async function uploadFile(file, table) {
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

    try {
      const response = await fetch("/api/upload", requestOptions);
      const result = await response.text();

      setApiCall((prev) => {
        const newDict = { ...prev };
        newDict[table].status = response.status;
        newDict[table].result = result;
        if (response.status === 200) {
          newDict[table].hasRun = true;
        }
        return newDict;
      });
    } catch (error) {
      console.log("error:", error);
    }
  }
  const resetAndUpload = async () => {
    if (!apiCall.reset.hasRun) {
      await executeSqlFile("reset");
      if (apiCall.reset.status === 200) {
        console.log("uploading");
        uploadedFiles.map((item) => uploadFile(item.file, item.table_name));
      } else {
        console.log("not uploading");
      }
    }
  };
  useEffect(() => {
    const runSequence = async () => {
      if (!sequenceCompleted) {
        if (
          apiCall.capitaldeploymentschedule.status === 200 &&
          apiCall.capitalreturnschedule.status === 200
        ) {
          if (!apiCall.capitaloutstandingbalance.hasRun)
            await executeSqlFile("capitaloutstandingbalance");
          if (apiCall.capitaloutstandingbalance.status === 200) {
            if (!apiCall.costofcapital.hasRun)
              await executeSqlFile("costofcapital");
            if (apiCall.costofcapital.status === 200) {
              if (!apiCall.cashflowschedule.hasRun)
                await executeSqlFile("cashflowschedule");
              if (apiCall.cashflowschedule.status === 200) {
                if (!apiCall.feeschedule.hasRun)
                  await executeSqlFile("feeschedule");
                if (apiCall.feeschedule.status == 200) {
                  if (!apiCall.missingdurations.hasRun)
                    await executeSqlFile("missingdurations");
                  if (apiCall.missingdurations.status === 200) {
                    if (!apiCall.summary.hasRun)
                      await executeSqlFile("summary");
                    if (apiCall.summary.status === 200) {
                      setSequenceCompleted(true);
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    runSequence();
  }, [
    apiCall.capitaldeploymentschedule.status,
    apiCall.capitalreturnschedule.status,
    apiCall.capitaloutstandingbalance.status,
    apiCall.costofcapital.status,
    apiCall.cashflowschedule.status,
    apiCall.feeschedule.status,
    apiCall.missingdurations.status,
  ]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      let newUploadedFiles = [...uploadedFiles];
      for (let i = 0; i < acceptedFiles.length; i++) {
        if (
          acceptedFiles[i].name == "capitalreturnschedule.csv" &&
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
          acceptedFiles[i].name == "capitaldeploymentschedule.csv" &&
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

  useLogger("apiCall", apiCall);
  return (
    <>
      <br />
      <div
        className="uploadContainer container"
        style={{ background: "white", padding: "2%", borderRadius: "15px" }}
      >
        <h4>Update schedules</h4>
        <div className="row">
          <div className="col">
            <div {...getRootProps()} style={dropStyle}>
              <br />
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
            </div>
          </div>
        </div>

        <br />
        <div
          className={`container btn btn-primary ${
            returnFile === 1 && deploymentFile === 1 ? "" : "disabled"
          }`}
          onClick={() => resetAndUpload()}
        >
          update schedule
        </div>

        <div
          className="container"
          style={{
            display: "grid",
            gap: "20px" /* Adjust the gap between items as needed */,
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            padding: "20px",
          }}
        >
          {Object.keys(apiCall).map((table) => (
            <DropzoneError key={table} table={table} apiCall={apiCall} />
          ))}
        </div>
      </div>
    </>
  );
}
