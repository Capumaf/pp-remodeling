// app/api/new-lead/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Email donde tú quieres recibir los mensajes
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "pumaangel205@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const message = body?.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not defined");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      // 👇 usa tu dominio verificado. Si tienes problemas, prueba con:
      // from: "P&P Remodeling <onboarding@resend.dev>",
      from: "P&P Remodeling <contact@pnp-remodeling.com>",
      to: [TO_EMAIL],
      subject: `New lead from ${name}`,
      html: `
        <h2>New contact from website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
