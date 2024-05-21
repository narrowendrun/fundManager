import Divider from "./Divider";
import InFlowLineItem from "./InFlowItem";

export default function Builder() {
  return (
    <>
      <Divider title={"Inflow Items"} />
      <br />
      <InFlowLineItem selectorOpacity={0.5} componentOpacity={1} />
      <InFlowLineItem selectorOpacity={0.3} componentOpacity={0.1} />
      <br />
      <br />
      <Divider title={"Outflow Items"} />
      <br />
    </>
  );
}
