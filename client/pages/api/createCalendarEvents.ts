import type { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "./calendar";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { calendarId, events } = req.body;
    const auth = await authorize();

    const calendar = google.calendar({ version: "v3", auth });
    for (const event of events) {
      const { Quiz, Topics, Textbook, Date } = event;
      await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: Quiz,
          description: `${Topics}\nTextbook Sections: ${Textbook}`,
          start: { date: Date },
          end: { date: Date },
        },
      });
    }

    res.status(201).json({ message: "Events created successfully" });
  } catch (error) {
    console.error("Error creating calendar events:", error);
    res.status(500).json({ error: "Failed to create calendar events" });
  }
}
