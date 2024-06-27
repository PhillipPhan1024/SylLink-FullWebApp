import type { NextApiRequest, NextApiResponse } from "next";
import { authorize, listEvents } from "./calendar";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const auth = await authorize();
    const events = await listEvents(auth);

    if (!events || events.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
}
