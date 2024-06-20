import React from "react";
import Link from "next/link";

export default function Home() {
    return (
      <main>
        <h1>Home</h1>
        <li>
          <Link href="/SyllabusPage">View your Syllabus</Link>
        </li>
        <li>
          <Link href="/calendar-events">Calendar</Link>
        </li>
      </main>
    );
}