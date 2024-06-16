import 'core-js/features/array/at'; // For Array.prototype.at
import 'core-js/features/promise/all-settled'; // For Promise.allSettled
import 'core-js/features/promise/with-resolvers'; // For Promise.withResolvers

import "@/styles/globals.css";
import React, { useEffect, useState } from "react";
import PDFViewer from "../components/PDFViewer";
import SelectionBoxInfo from "../components/SelectionBoxInfo";
import DragSelection from "../components/DragSelection";
import { Box } from "@air/react-drag-to-select";

const App = () => {
  const [selectionBox, setSelectionBox] = useState<Box>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/extractTables', {
          method: 'POST'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const results = await response.json();
        console.log(results);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchData();
  }, []);

  const sendData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sendData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectionBox)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="container">
      <PDFViewer file="Test_Syllabus.pdf" />
      <DragSelection setSelectionBox={setSelectionBox} />
      <SelectionBoxInfo selectionBox={selectionBox} />
      <button onClick={sendData}>Send Data to Server</button>
    </div>
  );
};

export default App;
