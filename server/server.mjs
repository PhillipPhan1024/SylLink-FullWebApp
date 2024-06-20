// server.mjs
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { extractTables } from "@krakz999/tabula-node";
import fetch from "node-fetch";
import { authorize, listEvents } from "./calendar.mjs"; // Import calendar functions

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/extractTables", async (req, res) => {
  try {
    const { left, top, right, bottom } = req.body;

    const results = await extractTables(
      "/Users/phil/vscode/SylLink-FullWebApp/client/public/Test_Syllabus.pdf",
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

    res.status(200).json({
      message: "Data received and tables extracted successfully",
      data: newData,
      extractionResults,
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
