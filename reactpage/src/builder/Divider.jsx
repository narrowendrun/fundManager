export default function Divider({ title }) {
  return (
    <>
      <div className="container" style={{ color: "white" }}>
        <h2>{title}</h2>
      </div>
      <div className="container" style={{ borderTop: "1px solid white" }}></div>
    </>
  );
}
