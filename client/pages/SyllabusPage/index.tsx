import Button from '../../components/Button';
import DragSelection from '../../components/DragSelection';
import PDFViewer from '../../components/PDFViewer';
import { Box } from '@air/react-drag-to-select'
import React, { useState } from 'react'

interface Props {}

const SyllabusPage = (props: Props) => {

    const [selectionBox, setSelectionBox] = useState<Box>();

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
        <PDFViewer file="Test_Syllabus.pdf">
          <Button color="blue" onClick={sendData}>
            Export to Calendar
          </Button>
        </PDFViewer>
        <DragSelection setSelectionBox={setSelectionBox} />
      </div>
    );
}

export default SyllabusPage