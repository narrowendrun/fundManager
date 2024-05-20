export default function DebtDataHeadings() {
  return (
    <>
      <div className="col">
        <div
          className="row"
          style={{
            borderTopLeftRadius: "12.5px",
          }}
        >
          <div className="col">.</div>
        </div>
        {/* <div className="row">
          <div className="col">debt : equity</div>
        </div> */}
        <div className="row">
          <div className="col">interest</div>
        </div>
        <div className="row">
          <div className="col">size</div>
        </div>
        <div
          className="row"
          style={{
            borderBottomLeftRadius: "12.5px",
          }}
        >
          <div className="col">splits</div>
        </div>
      </div>
    </>
  );
}
