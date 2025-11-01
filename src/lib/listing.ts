// src/lib/listing.ts
import { z } from "zod";

export const ListingSchema = z.object({
  title: z.string().min(1),
  price: z.union([z.number(), z.string()]),
  description: z.string().optional(),
  location: z.string().optional(),
  images: z.array(z.string()).optional(),
  seller: z.object({ name: z.string().optional() }).optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

/** Find the last UUIDv4 in a path like /listing/some-slug-<uuid> */
export function extractUuidFromListingUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const path = u.pathname; // e.g. /listing/2024-foo-bar-d2a03277-b4c6-4883-a00c-33ecfc91c25c
    const matches = path.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g
    );
    return matches ? matches[matches.length - 1] : null;
  } catch {
    return null;
  }
}

function parsePriceToNumber(price: number | string): number {
  if (typeof price === "number") return price;
  // Remove currency symbols and commas
  const n = Number(price.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(n)) throw new Error("Invalid price format");
  return n;
}

export async function fetchGarageListing(id: string, sourceUrl: string): Promise<Listing & { priceNumber: number }> {
  try {
    // Fetch the HTML page and extract data from __NEXT_DATA__
    const res = await fetch(sourceUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch listing page: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    
    // Extract JSON from __NEXT_DATA__ script tag
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!nextDataMatch) {
      throw new Error("Could not find __NEXT_DATA__ in page");
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const listingPreview = nextData?.props?.pageProps?.listingPreview;
    
    if (!listingPreview) {
      throw new Error("Could not find listingPreview in page data");
    }

    // Map the scraped data to our schema format
    const listingData = {
      title: listingPreview.listingTitle || "",
      price: listingPreview.sellingPrice || 0,
      description: listingPreview.listingDescription || undefined,
      location: undefined, // Not available in preview data
      images: listingPreview.imageUrl ? [listingPreview.imageUrl] : undefined,
      seller: undefined, // Not available in preview data
    };

    const parsed = ListingSchema.safeParse(listingData);
    if (!parsed.success) {
      throw new Error(`Unexpected listing data format: ${parsed.error.message}`);
    }

    const priceNumber = parsePriceToNumber(parsed.data.price);
    return { ...parsed.data, priceNumber };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to fetch listing data");
  }
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
