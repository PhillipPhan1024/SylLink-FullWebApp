import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ file }: { file: string }) => {
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
    <div className="pdf-viewer">
      <div className="pdf-document">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={1} />
        </Document>
      </div>
      <div className="pdf-controls">
        <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>Previous</button>
        <button onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</button>
        <span>Page {pageNumber} of {numPages}</span>
        <button onClick={downloadPdf}>Download</button>
      </div>
    </div>
  );
};

export default PDFViewer;
