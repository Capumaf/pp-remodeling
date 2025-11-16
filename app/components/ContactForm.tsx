"use client";

import { FormEvent, useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void;
    turnstile?: {
      reset: () => void;
    };
  }
}

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Callback global que usa el widget de Turnstile
  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus({ type: "idle" });

    if (!turnstileToken) {
      setStatus({
        type: "error",
        message: "Por favor completa la verificación anti-bots.",
      });
      return;
    }

    // Validación rápida frontend (la fuerte está en el backend)
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setStatus({
        type: "error",
        message: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const res = await fetch("/api/new-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error /api/new-lead:", data);
        setStatus({
          type: "error",
          message:
            data?.error ||
            "Hubo un problema al enviar el formulario. Inténtalo más tarde.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "¡Mensaje enviado! Te contactaremos muy pronto.",
      });
      setForm(initialFormState);
      setTurnstileToken(null);

      // Intentar resetear el widget de Turnstile
      try {
        window.turnstile?.reset();
      } catch {
        // ignorar si no existe
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          "Error de red al enviar el formulario. Verifica tu conexión e inténtalo de nuevo.",
      });
    }
  };  // cambio prueba


  return (
    <div className="p-5 sm:p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      {/* Script de Turnstile */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#1F2937] mb-1"
          >
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A]"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#1F2937] mb-1"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[#1F2937] mb-1"
          >
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A]"
            placeholder="(240) 418-4590"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-[#1F2937] mb-1"
          >
            Tell us about your project *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={form.message}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] resize-none"
            placeholder="What would you like to remodel? Timeline, budget, etc."
          />
        </div>

        {/* Turnstile Widget */}
        <div className="mt-2">
          {siteKey ? (
            <div
              className="cf-turnstile"
              data-sitekey={siteKey}
              data-callback="onTurnstileSuccess"
            />
          ) : (
            <p className="text-xs text-red-600">
              Falta configurar NEXT_PUBLIC_TURNSTILE_SITE_KEY en Vercel.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status.type === "loading"}
          className="inline-flex items-center justify-center w-full rounded-lg bg-[#16A34A] text-white text-sm font-semibold py-2.5 mt-2 hover:bg-[#15803D] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status.type === "loading" ? "Sending..." : "Send Message"}
        </button>

        {status.type === "error" && (
          <p className="text-xs text-red-600 mt-2">{status.message}</p>
        )}

        {status.type === "success" && (
          <p className="text-xs text-green-600 mt-2">{status.message}</p>
        )}

        <p className="text-[11px] text-gray-400 mt-2">
          By submitting this form, you agree to be contacted about your project.
        </p>
      </form>
    </div>
  );
}
