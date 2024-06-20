import Button from "../../components/Button";
import DragSelection from "../../components/DragSelection";
import PDFViewer from "../../components/PDFViewer";
import { Box } from "@air/react-drag-to-select";
import React, { useState } from "react";

interface Props {}

const SyllabusPage = (props: Props) => {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [calendarSummary, setCalendarSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const sendData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/sendData", {
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
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const createCalendar = async () => {
    setError(null); // Reset error state
    try {
      const response = await fetch("http://localhost:8080/api/createCalendar", {
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

  return (
    <div className="container">
      <PDFViewer file="Test_Syllabus.pdf">
        <Button color="blue" onClick={sendData}>
          Export to Calendar
        </Button>
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
