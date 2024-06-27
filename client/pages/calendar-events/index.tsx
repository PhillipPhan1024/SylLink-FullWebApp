import React from "react";
import { useState } from "react";

interface CalendarEvent {
  start: { dateTime?: string; date?: string };
  summary: string;
}

const CalendarEvents: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/calendarEvents");
      if (!response.ok) {
        throw new Error("Failed to fetch calendar events");
      }

      const data: CalendarEvent[] = await response.json();
      setEvents(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Google Calendar Events</h1>
      <button onClick={fetchEvents} disabled={loading}>
        {loading ? "Fetching Events..." : "Fetch Calendar Events"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {events.length === 0 && !loading && <li>No upcoming events found.</li>}
        {events.map((event, index) => (
          <li key={index}>
            {event.start.dateTime || event.start.date} - {event.summary}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarEvents;
