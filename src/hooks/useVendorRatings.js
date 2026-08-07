import { useLocalStorage } from "./useLocalStorage";

// { [vendorId]: { wishlist: boolean, visited: boolean, rating: 1-5, note: string } }
const EMPTY = { wishlist: false, visited: false, rating: 0, note: "" };

export function useVendorRatings() {
  const [ratings, setRatings] = useLocalStorage("vco_vendor_ratings", {});

  function getRating(vendorId) {
    return ratings[vendorId] || EMPTY;
  }

  function patch(vendorId, changes) {
    setRatings((prev) => ({
      ...prev,
      [vendorId]: { ...EMPTY, ...(prev[vendorId] || {}), ...changes },
    }));
  }

  function toggleWishlist(vendorId) {
    const current = getRating(vendorId);
    patch(vendorId, { wishlist: !current.wishlist });
  }

  function toggleVisited(vendorId) {
    const current = getRating(vendorId);
    const nextVisited = !current.visited;
    // Marking a place as visited naturally clears it off the "want to try" list.
    patch(vendorId, { visited: nextVisited, wishlist: nextVisited ? false : current.wishlist });
  }

  function rate(vendorId, stars) {
    patch(vendorId, { rating: stars, visited: true, wishlist: false });
  }

  function setNote(vendorId, note) {
    patch(vendorId, { note });
  }

  function replaceAll(nextRatings) {
    setRatings(nextRatings || {});
  }

  return { ratings, getRating, rate, toggleWishlist, toggleVisited, setNote, replaceAll };
}
