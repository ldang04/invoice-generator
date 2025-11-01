# Invoice Generator

A Next.js application that generates professional PDF invoices from ShopGarage vehicle listings. Simply paste a ShopGarage listing URL, fill in billing information, and generate a complete invoice PDF that can be downloaded or emailed.

## Main Functionality

This application allows users to:

1. **Generate Invoices**: Paste a ShopGarage listing URL to automatically fetch vehicle details and create a professional invoice PDF
2. **Edit Billing Information**: Fill in buyer/billing details through a live-updating form interface
3. **Preview PDFs**: View generated invoices in a scrollable PDF viewer before downloading
4. **Email Invoices**: Send completed invoices directly via email using Resend integration
5. **Live Updates**: See billing information update in the PDF in real-time as you type

## How It Works

### Architecture

- **Frontend**: Next.js with React, Tailwind CSS for styling, and `react-pdf` for PDF viewing
- **Backend**: Next.js API routes that handle PDF generation and email sending
- **PDF Generation**: Server-side PDF creation using `@react-pdf/renderer` (React-PDF)
- **Email Service**: Resend API integration for sending invoices with PDF attachments

### Key Components

- **`/api/invoice`**: API route that fetches listing data, generates PDFs, and returns them as downloadable files
- **`/api/send-email`**: API route that handles email sending via Resend with PDF attachments
- **`InvoicePDF`**: React component that defines the invoice layout and styling
- **`PDFViewer`**: Client-side component for displaying PDFs in the browser
- **`EmailModal`**: Modal interface for entering recipient email and sending invoices

### Invoice Fields Design

The invoice fields and structure were carefully designed based on research into existing fire department and emergency vehicle sales invoices. Using Perplexity AI research, the application includes:

- **Professional Header**: Invoice number, date, and order reference
- **Seller Information**: Pre-filled with Garage Technologies contact details
- **Buyer/Billing Information**: Editable fields for buyer contact and address
- **Vehicle Identification**: VIN, chassis number, serial number, and location fields
- **Vehicle Details**: Title, description, thumbnail image, and specifications
- **Payment Breakdown**: Itemized table with vehicle price, sales tax, delivery fees, documentation fees, and total
- **Delivery/Pickup Information**: Fields for delivery address, date, and transportation method
- **Terms and Conditions**: Standard "AS IS, WHERE IS" warranty disclaimer and payment terms
- **Signature Lines**: Spaces for authorized seller and buyer signatures with dates

This comprehensive structure ensures the generated invoices meet professional standards for fire department and emergency vehicle transactions.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-generator
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=your_verified_email@yourdomain.com
```

4. Copy the PDF.js worker file (if not already present):
```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

## Usage

1. **Generate Invoice**: 
   - Paste a ShopGarage listing URL (e.g., `https://www.shopgarage.com/listing/...`)
   - Click "Generate PDF"

2. **Fill Billing Information**:
   - Enter buyer name, company, address, phone, and email
   - The PDF updates automatically as you type (with a 1-second debounce)

3. **Preview & Download**:
   - Review the invoice in the PDF viewer
   - Click "Download PDF" to save the invoice

4. **Email Invoice**:
   - Click "Email PDF" button
   - Enter recipient email, subject, and optional message
   - Click "Send Email"

## Technology Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS 4
- **PDF Generation**: @react-pdf/renderer
- **PDF Viewing**: react-pdf (PDF.js)
- **Email**: Resend
- **Validation**: Zod
- **Language**: TypeScript

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── invoice/        # PDF generation endpoint
│   │   └── send-email/     # Email sending endpoint
│   ├── page.tsx            # Main application page
│   └── layout.tsx          # Root layout
├── components/
│   ├── InvoicePDF.tsx      # PDF template component
│   ├── PDFViewer.tsx       # PDF viewer component
│   └── EmailModal.tsx      # Email modal component
└── lib/
    └── listing.ts          # ShopGarage data fetching utilities
```

## Environment Variables

See `.env.example` for required environment variables:
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Verified sender email address (optional, defaults to onboarding@resend.dev)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React-PDF Documentation](https://react-pdf.org/)
- [Resend Documentation](https://resend.com/docs)
