import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Button from "./Button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string;
  children?: React.ReactNode;
}


const PDFViewer: React.FC<PDFViewerProps> = ({ file, children }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // Reset to page 1 on document load
  }

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const downloadPdf = () => {
    window.open(file, "_blank");
  };

  return (
    <div className="pdf-viewer flex flex-row">
      <div className="pdf-container"> 
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={1} />
        </Document>
      </div>
      <div className="pdf-controls flex flex-col justify-center ml-4 space-y-2">
        <Button
          color="blue"
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
        >
          Previous
        </Button>
        <Button
          color="blue"
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          Next
        </Button>
        <span className="px-4 py-2">
          Page {pageNumber} of {numPages}
        </span>
        {children}
      </div>
    </div>
  );
};

export default PDFViewer;
