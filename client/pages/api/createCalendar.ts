import type { NextApiRequest, NextApiResponse } from "next";
import { authorize, createCalendar, checkIfCalendarExists } from "./calendar";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { summary } = req.body;
    const auth = await authorize();

    const calendarExists = await checkIfCalendarExists(auth, summary);
    if (calendarExists) {
      return res
        .status(400)
        .json({ error: "Calendar with this summary already exists" });
    }

    const calendar = await createCalendar(auth, summary);

    res
      .status(201)
      .json({ message: "Calendar created successfully", calendar });
  } catch (error) {
    console.error("Error creating calendar:", error);
    res.status(500).json({ error: "Failed to create calendar" });
  }
}
