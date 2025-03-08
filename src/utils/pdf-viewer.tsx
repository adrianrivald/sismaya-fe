import { useState } from 'react';

import { Box } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfPreview = ({ pdfFile }: { pdfFile: any }) => (
  <Box overflow="auto" height="90vh">
    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
      <Viewer fileUrl={pdfFile} />
    </Worker>
    {/* <Document file={pdfFile} onLoadSuccess={({ numPages }) => setNumPdfPages(numPages)}>
          {Array.from(new Array(numPdfPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document> */}
  </Box>
);

export default PdfPreview;
