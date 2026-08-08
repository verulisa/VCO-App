import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";

// WMO weather codes (what Open-Meteo returns) collapsed down to a handful of
// icon + label buckets — festival-goers need "will it rain on me", not a
// precise meteorological classification.
const CODES = {
  0: { Icon: Sun, label: "Clear" },
  1: { Icon: CloudSun, label: "Mostly clear" },
  2: { Icon: CloudSun, label: "Partly cloudy" },
  3: { Icon: Cloud, label: "Overcast" },
  45: { Icon: CloudFog, label: "Foggy" },
  48: { Icon: CloudFog, label: "Foggy" },
  51: { Icon: CloudDrizzle, label: "Drizzle" },
  53: { Icon: CloudDrizzle, label: "Drizzle" },
  55: { Icon: CloudDrizzle, label: "Drizzle" },
  61: { Icon: CloudRain, label: "Rain" },
  63: { Icon: CloudRain, label: "Rain" },
  65: { Icon: CloudRain, label: "Heavy rain" },
  71: { Icon: CloudSnow, label: "Snow" },
  73: { Icon: CloudSnow, label: "Snow" },
  75: { Icon: CloudSnow, label: "Heavy snow" },
  80: { Icon: CloudRain, label: "Rain showers" },
  81: { Icon: CloudRain, label: "Rain showers" },
  82: { Icon: CloudRain, label: "Heavy showers" },
  95: { Icon: CloudLightning, label: "Thunderstorm" },
  96: { Icon: CloudLightning, label: "Thunderstorm" },
  99: { Icon: CloudLightning, label: "Thunderstorm" },
};

export function weatherIconFor(code) {
  return CODES[code] || { Icon: Cloud, label: "Weather" };
}
