import type { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "./calendar";
import { google } from "googleapis";

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
    const calendar = google.calendar({ version: "v3", auth });
    const response = await calendar.calendarList.list();
    res.status(200).json(response.data.items);
  } catch (error) {
    console.error("Error fetching calendar list:", error);
    res.status(500).json({ error: "Failed to fetch calendar list" });
  }
}
