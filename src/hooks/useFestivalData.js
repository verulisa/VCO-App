import { useCallback, useEffect, useState } from "react";

export function useFestivalData() {
  const [lineup, setLineup] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const load = useCallback((forceFresh = false) => {
    const opts = forceFresh ? { cache: "no-store" } : {};
    return Promise.all([
      fetch("data/lineup.json", opts).then((r) => r.json()),
      fetch("data/vendors.json", opts).then((r) => r.json()),
      fetch("data/info.json", opts).then((r) => r.json()),
    ]).then(([lineupData, vendorsData, infoData]) => {
      setLineup(lineupData);
      setVendors(vendorsData);
      setInfo(infoData);
      setStatus("ready");
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    load().catch(() => {
      if (!cancelled) setStatus("error");
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const reload = useCallback(() => load(true).catch(() => {}), [load]);

  return { lineup, vendors, info, status, reload };
}
