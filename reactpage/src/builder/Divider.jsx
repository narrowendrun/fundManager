export default function Divider({ title, button }) {
  return (
    <>
      <div
        className="container"
        style={{ marginTop: "2%", display: "flex", alignItems: "center" }}
      >
        <h2 style={{ width: "30%" }}>{title}</h2>
        {button ? <div className="btn btn-primary">+</div> : ""}
      </div>
      <div className="container" style={{ borderTop: "1px solid white" }}></div>
    </>
  );
}
