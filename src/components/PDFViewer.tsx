"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker only on client side
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PDFViewerProps {
  pdfUrl: string;
  onDownload?: () => void;
  onEmail?: () => void;
  updating?: boolean;
}

export default function PDFViewer({ pdfUrl, onDownload, onEmail, updating = false }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setError(error.message);
    setLoading(false);
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-neutral-200 p-4 md:p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-neutral-200">
        <h2 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-wide">Invoice Preview</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {numPages && (
            <span className="text-xs md:text-sm text-neutral-600 font-normal">
              {numPages} {numPages === 1 ? 'page' : 'pages'}
            </span>
          )}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-primary-500 text-white text-sm md:text-base font-medium rounded-xl hover:bg-primary-600 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Download PDF
              </button>
            )}
            {onEmail && (
              <button
                onClick={onEmail}
                className="flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-white border border-neutral-300 text-neutral-700 text-sm md:text-base font-medium rounded-xl hover:bg-neutral-50 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Email PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-neutral-500 font-normal">Loading PDF...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600 font-normal">Error loading PDF: {error}</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-neutral-100 rounded-xl p-4 max-h-[calc(100vh-200px)] relative">
        {updating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-primary-600">Updating...</p>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center py-12">
                <div className="text-neutral-500 font-normal">Loading PDF...</div>
              </div>
            }
          >
            {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <Page
                key={page}
                pageNumber={page}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg mb-4"
                width={typeof window !== "undefined" 
                  ? window.innerWidth < 640 
                    ? Math.min(600, window.innerWidth * 0.85)  // Mobile: 85% of screen width, max 600px
                    : Math.min(800, window.innerWidth - 200) // Desktop: wider view
                  : 800}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
