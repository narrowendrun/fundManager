export default function EquityDataHeadings() {
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

        <div className="row">
          <div className="col">preferred</div>
        </div>
        <div className="row">
          <div className="col">size</div>
        </div>

        <div className="row">
          <div className="col">splits</div>
        </div>
        <div className="row">
          <div className="col">payment</div>
        </div>
        <div
          className="row"
          style={{
            borderBottomLeftRadius: "12.5px",
          }}
        >
          <div className="col">tranche</div>
        </div>
      </div>
    </>
  );
}
