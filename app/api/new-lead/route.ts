import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email donde tú quieres recibir los mensajes
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "pumaangel205@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🔥 Enviar correo a tu email personal
    const result = await resend.emails.send({
      from: "P&P Remodeling <contact@pnp-remodeling.com>", // dominio verificado
      to: [TO_EMAIL],                                      // solo 1 "to" permitido
      subject: `New lead from ${name}`,
      html: `
        <h2>New contact from website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
