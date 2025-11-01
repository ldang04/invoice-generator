// src/app/api/invoice/route.tsx
// Note: File must be .tsx to support JSX syntax
import React from "react";
import { NextResponse } from "next/server";
import { z } from "zod";
import { extractUuidFromListingUrl, fetchGarageListing, formatUSD } from "@/lib/listing";
import InvoicePDF from "@/components/InvoicePDF";
import { pdf } from "@react-pdf/renderer";

export const runtime = "nodejs"; // ensure Node runtime for @react-pdf/renderer

const BodySchema = z.object({
  url: z.string().url(),
  buyerInfo: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    cityStateZip: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { url, buyerInfo } = BodySchema.parse(json);

    const id = extractUuidFromListingUrl(url);
    if (!id) {
      return NextResponse.json({ error: "Could not find UUID in URL." }, { status: 400 });
    }

    const listing = await fetchGarageListing(id, url);

    const now = new Date();
    const date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    // Generate invoice number: INV-YYYYMMDD-XXXXXXXX (first 8 chars of UUID)
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${id.slice(0, 8).toUpperCase()}`;

        const doc = (
          <InvoicePDF
            id={id}
            sourceUrl={url}
            date={date}
            invoiceNumber={invoiceNumber}
            title={listing.title}
            price={formatUSD(listing.priceNumber)}
            description={listing.description}
            location={listing.location}
            seller={listing.seller}
            thumbnailUrl={listing.images?.[0]}
            buyerInfo={buyerInfo}
          />
        );

    const pdfBuffer = await pdf(doc).toBuffer();

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=invoice.pdf`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const status = /ZodError|validation/i.test(msg) ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
