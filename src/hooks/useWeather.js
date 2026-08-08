import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { todayIso } from "../utils/time";

// Walesby Forest, Nottinghamshire, NG22 9NG — fixed to the venue rather than
// asking for the user's own location, so this never needs a permission
// prompt and always answers "what's it doing at the festival".
const LAT = 53.227;
const LON = -0.988;

const FORECAST_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
  `&timezone=Europe%2FLondon&forecast_days=1`;

// Open-Meteo needs no API key and allows direct browser requests — nothing
// to keep secret, nothing that can be scraped out of the bundle and abused.
export function useWeather() {
  const [cache, setCache] = useLocalStorage("vco_weather_cache", null);

  useEffect(() => {
    const today = todayIso();
    if (cache?.date === today) return;

    fetch(FORECAST_URL)
      .then((r) => r.json())
      .then((data) => {
        setCache({
          date: today,
          current: { temp: data.current.temperature_2m, code: data.current.weather_code },
          daily: {
            tempMax: data.daily.temperature_2m_max[0],
            tempMin: data.daily.temperature_2m_min[0],
            precipProbMax: data.daily.precipitation_probability_max[0],
            uvMax: data.daily.uv_index_max[0],
          },
        });
      })
      .catch(() => {
        // Offline, or the API's down — leave the cache exactly as it is
        // (even a day-old forecast) rather than clearing it. No network
        // ever means no weather at all, which the caller handles too.
      });
  }, [cache?.date, setCache]);

  return cache;
}
