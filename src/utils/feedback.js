const FEEDBACK_EMAIL = "veronika@blackdaisy.eu";

// A plain mailto: link — no backend to send this to, and it works
// everywhere without asking for any permission. Pre-fills the boring parts
// (device, page, time, and the error itself if there is one) so a report is
// just "what happened" typed in, not a screenshot-and-explain round trip.
export function buildFeedbackMailto({ errorDetails } = {}) {
  const subject = errorDetails ? "Vegan Camp Out app — crash report" : "Vegan Camp Out app — problem report";
  const lines = ["What happened?", "", "", "", "---", `Page: ${window.location.href}`, `Device: ${navigator.userAgent}`, `Time: ${new Date().toISOString()}`];
  if (errorDetails) lines.push(`Error: ${errorDetails}`);
  const body = lines.join("\n");
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
