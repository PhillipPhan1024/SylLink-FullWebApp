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
      /**
       * Here we make sure to adjust the box's left and top with the scroll position of the window
       * @see https://github.com/AirLabsTeam/react-drag-to-select/#scrolling
       */
      const scrollAwareBox: Box = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
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
  }, []);

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
    </div>
  );
};

export default App;

