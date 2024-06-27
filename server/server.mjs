import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { extractTables } from "@krakz999/tabula-node";
import fetch from "node-fetch";
import path from "path";
import {
  authorize,
  listEvents,
  createCalendar,
  checkIfCalendarExists,
} from "./calendar.js";
import { google } from "googleapis";
import OpenAI from "openai";

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
  }
);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/extractTables", async (req, res) => {
  try {
    const { left, top, right, bottom } = req.body;

    const results = await extractTables(
      path.resolve(__dirname, "../client/public/Test_Syllabus.pdf"),
      {
        pages: "3",
        area: `${top},${left},${bottom},${right}`,
      }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error extracting tables:", error);
    res.status(500).json({ error: "Failed to extract tables" });
  }
});

app.post("/api/formatData", async (req, res) => {
  try {
    const { data } = req.body;

    const prompt = `Format the following data for calendar events: ${data}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    const formattedData = response.choices[0].text.trim();

    res.status(200).json({ formattedData });
  } catch (error) {
    console.error("Error formatting data:", error);
    res.status(500).json({ error: "Error generating response from OpenAI" });
  }
});

app.post("/api/sendData", async (req, res) => {
  try {
    const { left, top, width, height } = req.body;
    const right = left + width;
    const bottom = top + height;

    const newData = {
      left,
      top,
      width,
      height,
      right,
      bottom,
    };

    console.log("Received data:", newData);

    const response = await fetch("http://localhost:8080/api/extractTables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error("Failed to extract tables");
    }

    const extractionResults = await response.json();

    const openAIResponse = await fetch("http://localhost:8080/api/formatData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: extractionResults }),
    });

    if (!openAIResponse.ok) {
      throw new Error("Failed to format data");
    }

    const { formattedData } = await openAIResponse.json();

    res.status(200).json({
      message: "Data received and tables extracted successfully",
      data: newData,
      extractionResults,
      formattedData,
    });
  } catch (error) {
    console.error("Error receiving or forwarding data:", error);
    res.status(500).json({ error: "Failed to receive or forward data" });
  }
});

app.get("/api/calendarEvents", async (req, res) => {
  try {
    const auth = await authorize();
    const events = await listEvents(auth);

    if (!events || events.length === 0) {
      res.status(200).json({ message: "No upcoming events found." });
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

app.get("/api/calendarList", async (req, res) => {
  try {
    const auth = await authorize();
    const calendar = google.calendar({ version: "v3", auth });
    const response = await calendar.calendarList.list();
    res.status(200).json(response.data.items);
  } catch (error) {
    console.error("Error fetching calendar list:", error);
    res.status(500).json({ error: "Failed to fetch calendar list" });
  }
});

app.post("/api/createCalendar", async (req, res) => {
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

    res.status(201).json({
      message: "Calendar created successfully",
      calendar,
    });
  } catch (error) {
    console.error("Error creating calendar:", error);
    res.status(500).json({ error: "Failed to create calendar" });
  }
});

app.post("/api/createCalendarEvents", async (req, res) => {
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
          start: {
            date: Date,
          },
          end: {
            date: Date,
          },
        },
      });
    }

    res.status(201).json({
      message: "Events created successfully",
    });
  } catch (error) {
    console.error("Error creating calendar events:", error);
    res.status(500).json({ error: "Failed to create calendar events" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
