import "@/styles/globals.css";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  useSelectionContainer
} from "@air/react-drag-to-select";

const App = () => {
  const [selectionBox, setSelectionBox] = useState<Box>();
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);
  const selectableItems = useRef<Box[]>([]);

  const { DragSelection } = useSelectionContainer({
    onSelectionChange: (box) => {
      const scrollAwareBox: Box = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };

      setSelectionBox(scrollAwareBox);
    },
    onSelectionStart: () => {
      console.log("OnSelectionStart");
    },
    onSelectionEnd: () => console.log("OnSelectionEnd"),
    selectionProps: {
      style: {
        border: "2px dashed purple",
        borderRadius: 4,
        backgroundColor: "red",
        opacity: 0.5
      }
    },
    isEnabled: true
  });

  useEffect(() => {
    if (elementsContainerRef.current) {
      Array.from(elementsContainerRef.current.children).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItems.current.push({
          left,
          top,
          width,
          height
        });
      });
    }

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
      <DragSelection />
      <div className="selection-box-info">
        Selection Box:
        <div>top: {selectionBox?.top || ""}</div>
        <div>left: {selectionBox?.left || ""}</div>
        <div>width: {selectionBox?.width || ""}</div>
        <div>height: {selectionBox?.height || ""}</div>
      </div>
      <button onClick={sendData}>Send Data to Server</button>
    </div>
  );
};

export default App;
