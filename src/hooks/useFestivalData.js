import { useEffect, useState } from "react";

export function useFestivalData() {
  const [lineup, setLineup] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("data/lineup.json").then((r) => r.json()),
      fetch("data/vendors.json").then((r) => r.json()),
      fetch("data/info.json").then((r) => r.json()),
    ])
      .then(([lineupData, vendorsData, infoData]) => {
        if (cancelled) return;
        setLineup(lineupData);
        setVendors(vendorsData);
        setInfo(infoData);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { lineup, vendors, info, status };
}
