import { useLocalStorage } from "./useLocalStorage";

// { [vendorId]: { rating: 1-5, tried: boolean, note: string } }
export function useVendorRatings() {
  const [ratings, setRatings] = useLocalStorage("vco_vendor_ratings", {});

  function getRating(vendorId) {
    return ratings[vendorId] || { rating: 0, tried: false, note: "" };
  }

  function setRating(vendorId, patch) {
    setRatings((prev) => ({
      ...prev,
      [vendorId]: { ...getRating(vendorId), ...patch },
    }));
  }

  function rate(vendorId, stars) {
    setRating(vendorId, { rating: stars, tried: true });
  }

  function toggleTried(vendorId) {
    const current = getRating(vendorId);
    setRating(vendorId, { tried: !current.tried });
  }

  function setNote(vendorId, note) {
    setRating(vendorId, { note });
  }

  return { ratings, getRating, rate, toggleTried, setNote };
}
