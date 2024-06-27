import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import DragSelection from "../../components/DragSelection";
import PDFViewer from "../../components/PDFViewer";
import { Box } from "@air/react-drag-to-select";

interface Props {}

interface Calendar {
  id: string;
  summary: string;
}

const SyllabusPage = (props: Props) => {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [calendarId, setCalendarId] = useState<string>("");
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [calendarSummary, setCalendarSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initially set to true

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/listCalendars");
        if (!response.ok) {
          throw new Error("Failed to fetch calendars");
        }
        const data = await response.json();
        console.log("Fetched calendars:", data); // Debug log
        setCalendars(data); // Assuming API returns an array directly
      } catch (error: any) {
        setError(error.message || "Failed to fetch calendars");
        console.error("Error fetching calendars:", error);
      } finally {
        setLoading(false); // Set loading to false once fetch is done
      }
    };

    fetchCalendars();
  }, []);

  const parseExtractionResults = (data: string) => {
    const rows = data.split("\r\n").filter((row) => row.trim() !== "");
    const headers = rows.shift()?.split(",") || [];
    return rows.map((row) => {
      const values = row.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {} as Record<string, string>);
    });
  };

  const sendData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sendData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectionBox),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);

      const parsedData = parseExtractionResults(result.extractionResults);

      const createEventsResponse = await fetch(
        "http://localhost:3000/api/createCalendarEvents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calendarId, events: parsedData }),
        }
      );

      if (!createEventsResponse.ok) {
        throw new Error("Failed to create calendar events");
      }

      const createEventsResult = await createEventsResponse.json();
      console.log(createEventsResult);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const createCalendar = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/createCalendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary: calendarSummary }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create calendar");
      }

      const data = await response.json();
      alert(`Calendar created: ${data.calendar.summary}`);
    } catch (error: any) {
      setError(error.message);
      console.error("Error creating calendar:", error);
    }
  };

  if (loading) {
    return <p>Loading calendars...</p>;
  }

  return (
    <div className="container">
      <PDFViewer file="Test_Syllabus.pdf">
        <Button color="blue" onClick={sendData}>
          Export to Calendar
        </Button>
        <select
          value={calendarId}
          onChange={(e) => setCalendarId(e.target.value)}
        >
          <option value="">Select Calendar</option>
          {calendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.summary}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={calendarSummary}
          onChange={(e) => setCalendarSummary(e.target.value)}
          placeholder="Calendar Name"
        />
        <Button color="blue" onClick={createCalendar}>
          Create new Sub-Calendar
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </PDFViewer>
      <DragSelection setSelectionBox={setSelectionBox} />
    </div>
  );
};

export default SyllabusPage;
