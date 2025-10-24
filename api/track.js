import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { tracking_number } = req.body;
  if (!tracking_number) return res.status(400).json({ error: "Tracking number required" });

  const DELHIVERY_API_KEY = process.env.DELHIVERY_API_KEY;

  try {
    const response = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${tracking_number}`, {
      headers: { "Authorization": `Token ${DELHIVERY_API_KEY}` },
    });

    if (!response.ok) throw new Error("Failed to fetch Delhivery");

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
