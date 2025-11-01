import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Resend API key is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const formData = await req.formData();
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const pdfFile = formData.get("pdf") as File;

    if (!email || !pdfFile) {
      return NextResponse.json(
        { error: "Email and PDF file are required" },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Resend
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get the from email from env or use a default
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: subject || "Invoice",
      html: `<p>${message || "Please find the invoice attached."}</p>`,
      attachments: [
        {
          filename: "invoice.pdf",
          content: buffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (err: unknown) {
    console.error("Resend error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

