// Professor Vision needs the Hatchable AI connection, which this host does not have.
// Answer clearly so the app shows a graceful message; the rest of the course is unaffected.
export default function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  return res.status(503).json({ error: "vision_unavailable_on_this_host", message: "Professor Vision is not connected on this host. Everything else in the course works." });
}
