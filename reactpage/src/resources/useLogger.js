import { useEffect } from "react";
export default function useLogger(title, data) {
  useEffect(() => {
    console.log(`${title} :`, data);
  }, [data]);
}
