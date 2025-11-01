// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import dynamic from "next/dynamic";
import EmailModal from "@/components/EmailModal";

// Dynamically import PDFViewer to avoid SSR issues with react-pdf
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-neutral-200 p-4 md:p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-neutral-200">
        <h2 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-wide">Invoice Preview</h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-neutral-100 rounded-xl p-4 max-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-neutral-500 font-normal">Loading PDF viewer...</div>
      </div>
    </div>
  ),
});

const UrlSchema = z.string().url();

export default function Home() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    company: "",
    address1: "",
    address2: "",
    cityStateZip: "",
    phone: "",
    email: "",
  });
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  const looksValid = (() => {
    try {
      UrlSchema.parse(url);
      return /\/listing\//.test(url); // cheap extra hint
    } catch {
      return false;
    }
  })();

  async function generatePDF(buyerData?: typeof buyerInfo) {
    setError(null);
    const isUpdate = !!pdfUrl;
    if (isUpdate) {
      setUpdating(true);
    } else {
      setBusy(true);
      setPdfUrl(null);
    }
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url,
          buyerInfo: buyerData || buyerInfo,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      setPdfUrl(href);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err 
        ? String(err.message) 
        : "Something went wrong";
      setError(message);
    } finally {
      setBusy(false);
      setUpdating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await generatePDF();
  }

  function handleBuyerInfoChange(field: keyof typeof buyerInfo, value: string) {
    const updatedInfo = { ...buyerInfo, [field]: value };
    setBuyerInfo(updatedInfo);
    
    // Debounce the PDF update - wait 1 second after user stops typing
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (pdfUrl) {
        generatePDF(updatedInfo);
      }
    }, 1000);
    
    setUpdateTimeout(timeout);
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, [updateTimeout]);

  function handleDownload() {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left Column: Forms - 30% width */}
          <div className="lg:w-[30%] space-y-4 md:space-y-6">
            {/* Generate Invoice Form */}
            <div className="rounded-2xl bg-white shadow-lg border border-neutral-200 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="size-4 md:size-[18px] stroke-2 stroke-neutral-900"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
                <h1 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-wide">Generate an Invoice</h1>
              </div>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <input
                  type="url"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.shopgarage.com/listing/..."
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!looksValid || busy}
                  className="w-full rounded-xl bg-primary-500 text-white font-medium py-2.5 md:py-2.5 text-sm md:text-base hover:bg-primary-600 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? "Generating…" : "Generate PDF"}
                </button>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              </form>
            </div>

            {/* Billing Information Form - Only show when PDF is generated */}
            {pdfUrl && (
              <div className="rounded-2xl bg-white shadow-lg border border-neutral-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-wide mb-4">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">Buyer Name</label>
                    <input
                      type="text"
                      value={buyerInfo.name}
                      onChange={(e) => handleBuyerInfoChange("name", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Buyer Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">Company/Department</label>
                    <input
                      type="text"
                      value={buyerInfo.company}
                      onChange={(e) => handleBuyerInfoChange("company", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Company/Department"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={buyerInfo.address1}
                      onChange={(e) => handleBuyerInfoChange("address1", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Address Line 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={buyerInfo.address2}
                      onChange={(e) => handleBuyerInfoChange("address2", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Address Line 2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">City, State ZIP</label>
                    <input
                      type="text"
                      value={buyerInfo.cityStateZip}
                      onChange={(e) => handleBuyerInfoChange("cityStateZip", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="City, State ZIP"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={buyerInfo.phone}
                      onChange={(e) => handleBuyerInfoChange("phone", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={buyerInfo.email}
                      onChange={(e) => handleBuyerInfoChange("email", e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: PDF Viewer - 70% width */}
          <div className="lg:w-[70%] lg:min-w-0">
            {pdfUrl ? (
              <PDFViewer pdfUrl={pdfUrl} onDownload={handleDownload} onEmail={() => setShowEmailModal(true)} updating={updating} />
            ) : (
              <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold text-neutral-900 tracking-wide">Invoice Preview</h2>
                </div>
                <div className="flex-1 overflow-y-auto bg-neutral-100 rounded-xl p-4 max-h-[calc(100vh-200px)] min-h-[calc(100vh-200px)] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12 md:w-16 md:h-16 text-neutral-300 mb-3 md:mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <p className="text-sm md:text-lg font-medium text-neutral-600 px-4">
                      Invoice preview will appear once a listing is posted
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && pdfUrl && (
        <EmailModal
          pdfUrl={pdfUrl}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </main>
  );
}
