import React from 'react';
import { useSelectionContainer, Box } from "@air/react-drag-to-select";

const DragSelection = ({ setSelectionBox }: { setSelectionBox: React.Dispatch<React.SetStateAction<Box | undefined>> }) => {
  const { DragSelection: InnerDragSelection } = useSelectionContainer({
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

  return <InnerDragSelection />;
};

export default DragSelection;
