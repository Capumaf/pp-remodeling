// app/api/new-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { contactSchema, sanitizeText } from "../../lib/validation/contact";

// ---------- Resend ----------
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom =
  process.env.RESEND_FROM ?? "PNP Remodeling <no-reply@pnp-remodeling.com>";
const resendTo = process.env.RESEND_TO ?? "pumaangel205@gmail.com";

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY no está configurada.");
}

const resend = new Resend(resendApiKey);

// ---------- Upstash Rate Limit ----------
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      // Máx 5 formularios por IP cada 10 minutos
      limiter: Ratelimit.fixedWindow(5, "600 s"),
      prefix: "new-lead",
    })
  : null;

// ---------- Turnstile ----------
async function verifyTurnstileToken(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY no configurado");
    return false;
  }

  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
      }
    );

    if (!res.ok) {
      console.error("Error HTTP Turnstile:", res.status);
      return false;
    }

    const data = (await res.json()) as {
      success: boolean;
      ["error-codes"]?: string[];
    };

    if (!data.success) {
      console.warn("Turnstile falló:", data["error-codes"]);
    }

    return data.success;
  } catch (err) {
    console.error("Excepción verificando Turnstile:", err);
    return false;
  }
}

// ---------- Esquema backend (contact + turnstile) ----------
const leadSchema = contactSchema.extend({
  turnstileToken: z.string().min(1, "Falta la verificación anti-bots."),
});

// ---------- Handler principal ----------
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type debe ser application/json" },
        { status: 415 }
      );
    }

    const ipHeader = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    // @ts-ignore (Next no tipa ip en Request)
    const ip = ipHeader || req.ip || "unknown";

    // Rate limiting
    if (ratelimit) {
      const { success, remaining, reset } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          {
            error: "Demasiadas solicitudes. Inténtalo de nuevo más tarde.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": "5",
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    } else {
      console.warn("Upstash no configurado: rate limiting desactivado.");
    }

    const body = await req.json();

    // Validación (frontend + backend usan el mismo esquema base)
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Datos inválidos", details: errors },
        { status: 400 }
      );
    }

    const { name, email, phone, message, company, turnstileToken } =
      parsed.data;

    // Honeypot (si company trae algo -> bot)
    if (company && company.trim().length > 0) {
      return NextResponse.json(
        { error: "Verificación anti-spam fallida." },
        { status: 400 }
      );
    }

    // Verificar Turnstile (anti-bots)
    const isHuman = await verifyTurnstileToken(
      turnstileToken,
      ip === "unknown" ? null : ip
    );
    if (!isHuman) {
      return NextResponse.json(
        { error: "Verificación anti-bots fallida." },
        { status: 400 }
      );
    }

    // Sanitización extra en backend
    const safeName = sanitizeText(name);
    const safeEmail = sanitizeText(email);
    const safePhone = sanitizeText(phone);
    const safeMessage = sanitizeText(message);

    const truncate = (s: string, max: number) =>
      s.length > max ? s.slice(0, max) : s;

    const emailText = [
      "Nueva solicitud desde el formulario de pnp-remodeling.com",
      "",
      `Nombre:   ${truncate(safeName, 100)}`,
      `Email:    ${truncate(safeEmail, 254)}`,
      `Teléfono: ${truncate(safePhone, 30)}`,
      "",
      "Mensaje:",
      truncate(safeMessage, 2000),
    ].join("\n");

    const result = await resend.emails.send({
      from: resendFrom,
      to: [resendTo],
      subject: "Nueva solicitud desde pnp-remodeling.com",
      text: emailText, // solo texto, seguro contra XSS
    });

    console.log("Nuevo lead OK", {
      ip,
      emailPreview: safeEmail.replace(/(.{3}).+(@.+)/, "$1****$2"),
      messageLength: safeMessage.length,
      resendId: (result as any)?.id ?? null,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error en /api/new-lead:", err);
    return NextResponse.json(
      { error: "Error interno al procesar el formulario." },
      { status: 500 }
    );
  }
}
