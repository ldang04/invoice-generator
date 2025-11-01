// src/components/InvoicePDF.tsx
// Server-only component - React-PDF must render on server.
// DO NOT add "use client"

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 4,
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 4,
  },
  invoiceNumber: {
    fontSize: 11,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 10,
    color: "#6b7280",
  },
  twoColumn: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
  },
  column: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  valueBold: {
    fontSize: 10,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  thumbnail: {
    width: 180,
    height: 135,
    objectFit: "cover",
    borderRadius: 4,
    marginTop: 8,
  },
  table: {
    marginTop: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  tableCellRight: {
    textAlign: "right",
  },
  tableHeader: {
    fontWeight: 700,
    color: "#000000",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#000000",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#000000",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#000000",
  },
  signatureBox: {
    marginTop: 24,
    flexDirection: "row",
    gap: 40,
  },
  signatureField: {
    flex: 1,
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 8,
  },
  terms: {
    marginTop: 20,
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },
});

export interface InvoicePDFProps {
  title: string;
  price: string;
  description?: string;
  id: string;
  sourceUrl: string;
  date: string;
  invoiceNumber: string;
  thumbnailUrl?: string;
  seller?: { name?: string };
  location?: string;
  vin?: string;
  chassisNumber?: string;
  serialNumber?: string;
  buyerInfo?: {
    name?: string;
    company?: string;
    address1?: string;
    address2?: string;
    cityStateZip?: string;
    phone?: string;
    email?: string;
  };
}

export default function InvoicePDF(props: InvoicePDFProps) {
  const {
    title,
    price,
    description,
    id,
    sourceUrl,
    date,
    invoiceNumber,
    thumbnailUrl,
    seller,
    location,
    vin,
    chassisNumber,
    serialNumber,
    buyerInfo,
  } = props;

  const clampedDescription = description && description.length > 800 
    ? description.slice(0, 797) + "..." 
    : description;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>INVOICE</Text>
            <Text style={styles.headerSubtitle}>Garage Technologies, Inc.</Text>
            <Text style={styles.headerSubtitle}>www.shopgarage.com</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceNumber}>Invoice #: {invoiceNumber}</Text>
            <Text style={styles.headerDate}>Date: {date}</Text>
            <Text style={styles.headerDate}>Order #: {id.slice(0, 8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Seller and Buyer Information */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>SELLER</Text>
            <Text style={styles.valueBold}>Garage Technologies, Inc.</Text>
            <Text style={styles.value}>Phone: (201) 293-7164</Text>
            <Text style={styles.value}>Email: support@shopgarage.com</Text>
            <Text style={styles.value}>Website: www.shopgarage.com</Text>
            {seller?.name && (
              <>
                <Text style={[styles.label, { marginTop: 8 }]}>Listed By</Text>
                <Text style={styles.value}>{seller.name}</Text>
              </>
            )}
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>BILL TO</Text>
            <Text style={styles.value}>{buyerInfo?.name || "[Buyer Name]"}</Text>
            <Text style={styles.value}>{buyerInfo?.company || "[Company/Department]"}</Text>
            <Text style={styles.value}>{buyerInfo?.address1 || "[Address Line 1]"}</Text>
            <Text style={styles.value}>{buyerInfo?.address2 || "[Address Line 2]"}</Text>
            <Text style={styles.value}>{buyerInfo?.cityStateZip || "[City, State ZIP]"}</Text>
            <Text style={styles.value}>{buyerInfo?.phone || "[Phone]"}</Text>
            <Text style={styles.value}>{buyerInfo?.email || "[Email]"}</Text>
          </View>
        </View>

        {/* Vehicle Identification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VEHICLE IDENTIFICATION</Text>
          <Text style={styles.label}>Vehicle Title</Text>
          <Text style={styles.valueBold}>{title}</Text>
          
          <View style={styles.row}>
            {vin && (
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>VIN</Text>
                <Text style={styles.value}>{vin}</Text>
              </View>
            )}
            {chassisNumber && (
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Chassis Number</Text>
                <Text style={styles.value}>{chassisNumber}</Text>
              </View>
            )}
            {serialNumber && (
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Serial Number</Text>
                <Text style={styles.value}>{serialNumber}</Text>
              </View>
            )}
          </View>
          
          {location && (
            <>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{location}</Text>
            </>
          )}
        </View>

        {/* Vehicle Image */}
        {thumbnailUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Image</Text>
            <Image style={styles.thumbnail} src={thumbnailUrl} />
          </View>
        )}

        {/* Description */}
        {clampedDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Description & Features</Text>
            <Text style={styles.value}>{clampedDescription}</Text>
          </View>
        )}

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT BREAKDOWN</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={[styles.tableCell, styles.tableCellRight]}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Vehicle Purchase Price</Text>
              <Text style={[styles.tableCell, styles.tableCellRight]}>{price}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Sales Tax (if applicable)</Text>
              <Text style={[styles.tableCell, styles.tableCellRight]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Delivery/Transportation</Text>
              <Text style={[styles.tableCell, styles.tableCellRight]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Documentation Fees</Text>
              <Text style={[styles.tableCell, styles.tableCellRight]}>—</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL DUE</Text>
            <Text style={styles.totalValue}>{price}</Text>
          </View>
        </View>

        {/* Delivery/Pickup Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DELIVERY / PICKUP INFORMATION</Text>
          <Text style={styles.label}>Delivery Address</Text>
          <Text style={styles.value}>[To be specified by buyer]</Text>
          <Text style={styles.label}>Expected Delivery/Pickup Date</Text>
          <Text style={styles.value}>[To be arranged]</Text>
          <Text style={styles.label}>Transportation Method</Text>
          <Text style={styles.value}>[To be arranged]</Text>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TERMS AND CONDITIONS</Text>
          <Text style={styles.terms}>
            <Text style={styles.valueBold}>Payment Terms:</Text> Net 30 days. Payment via wire transfer preferred. Wire transfer instructions will be provided upon request.
          </Text>
          <Text style={styles.terms}>
            <Text style={styles.valueBold}>Delivery Terms:</Text> Delivery/pickup arrangements to be coordinated between buyer and seller. All transportation costs are the responsibility of the buyer unless otherwise specified.
          </Text>
          <Text style={styles.terms}>
            <Text style={styles.valueBold}>Warranty:</Text> Vehicle sold &quot;AS IS, WHERE IS&quot; with no warranties expressed or implied. Buyer acknowledges inspection of vehicle and acceptance of condition.
          </Text>
          <Text style={styles.terms}>
            <Text style={styles.valueBold}>Title Transfer:</Text> Title transfer will be completed upon receipt of full payment. All applicable documentation and registration materials will be provided.
          </Text>
          <Text style={styles.terms}>
            <Text style={styles.valueBold}>Disclaimers:</Text> Seller makes no representations or warranties regarding the condition, merchantability, or fitness for a particular purpose of the vehicle. Buyer assumes all risks associated with the purchase and use of the vehicle.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureBox}>
          <View style={styles.signatureField}>
            <Text style={styles.signatureLabel}>Seller Signature</Text>
            <Text style={styles.signatureLabel}>Garage Technologies, Inc.</Text>
            <Text style={[styles.signatureLabel, { marginTop: 16 }]}>Date: _______________</Text>
          </View>
          <View style={styles.signatureField}>
            <Text style={styles.signatureLabel}>Buyer Signature</Text>
            <Text style={styles.signatureLabel}>_________________________</Text>
            <Text style={[styles.signatureLabel, { marginTop: 16 }]}>Date: _______________</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This invoice was generated on {date}. For questions or support, contact (201) 293-7164 or support@withgarage.com</Text>
          <Text style={{ marginTop: 4 }}>Listing ID: {id} | Source: {sourceUrl}</Text>
        </View>
      </Page>
    </Document>
  );
}
