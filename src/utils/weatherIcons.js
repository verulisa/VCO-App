import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";

// WMO weather codes (what Open-Meteo returns) collapsed down to a handful of
// icon + label buckets — festival-goers need "will it rain on me", not a
// precise meteorological classification. Each also carries a colour: on a
// clear day this is literally the same Sun glyph as the light/dark toggle,
// so a plain grey icon here was easy to mistake for that button at a
// glance — the colour is what actually tells them apart now.
const CODES = {
  0: { Icon: Sun, label: "Clear", color: "var(--vco-yellow)" },
  1: { Icon: CloudSun, label: "Mostly clear", color: "var(--vco-yellow)" },
  2: { Icon: CloudSun, label: "Partly cloudy", color: "var(--vco-text-muted)" },
  3: { Icon: Cloud, label: "Overcast", color: "var(--vco-text-muted)" },
  45: { Icon: CloudFog, label: "Foggy", color: "var(--vco-text-muted)" },
  48: { Icon: CloudFog, label: "Foggy", color: "var(--vco-text-muted)" },
  51: { Icon: CloudDrizzle, label: "Drizzle", color: "var(--vco-text-muted)" },
  53: { Icon: CloudDrizzle, label: "Drizzle", color: "var(--vco-text-muted)" },
  55: { Icon: CloudDrizzle, label: "Drizzle", color: "var(--vco-text-muted)" },
  61: { Icon: CloudRain, label: "Rain", color: "var(--vco-text-muted)" },
  63: { Icon: CloudRain, label: "Rain", color: "var(--vco-text-muted)" },
  65: { Icon: CloudRain, label: "Heavy rain", color: "var(--vco-text-muted)" },
  71: { Icon: CloudSnow, label: "Snow", color: "var(--vco-text-muted)" },
  73: { Icon: CloudSnow, label: "Snow", color: "var(--vco-text-muted)" },
  75: { Icon: CloudSnow, label: "Heavy snow", color: "var(--vco-text-muted)" },
  80: { Icon: CloudRain, label: "Rain showers", color: "var(--vco-text-muted)" },
  81: { Icon: CloudRain, label: "Rain showers", color: "var(--vco-text-muted)" },
  82: { Icon: CloudRain, label: "Heavy showers", color: "var(--vco-text-muted)" },
  95: { Icon: CloudLightning, label: "Thunderstorm", color: "var(--vco-red)" },
  96: { Icon: CloudLightning, label: "Thunderstorm", color: "var(--vco-red)" },
  99: { Icon: CloudLightning, label: "Thunderstorm", color: "var(--vco-red)" },
};

export function weatherIconFor(code) {
  return CODES[code] || { Icon: Cloud, label: "Weather", color: "var(--vco-text-muted)" };
}
