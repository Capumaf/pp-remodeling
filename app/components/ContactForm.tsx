"use client";

import { FormEvent, useEffect, useState } from "react";
import Script from "next/script";
import { contactSchema } from "../lib/validation/contact";

declare global {
  interface Window {
    onTurnstileLoad?: () => void;
    turnstile?: {
      render: (
        target: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
        }
      ) => void;
      reset: () => void;
    };
  }
}

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string; // honeypot
};

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  company: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Render explícito de Turnstile cuando el script carga
  useEffect(() => {
    if (!siteKey) return;

    window.onTurnstileLoad = () => {
      if (!window.turnstile) return;
      window.turnstile.render("#turnstile-widget", {
        sitekey: siteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
        },
      });
    };
  }, [siteKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus({ type: "idle" });
    setFieldErrors({});

    if (!turnstileToken) {
      setStatus({
        type: "error",
        message: "Por favor completa la verificación anti-bots.",
      });
      return;
    }

    // Validación fuerte en frontend
    const raw = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      company: form.company,
    };

    const parsed = contactSchema.safeParse(raw);

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() || "form";
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });

      setFieldErrors(newErrors);
      setStatus({
        type: "error",
        message: "Por favor revisa los campos marcados.",
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
          ...raw,
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

      try {
        window.turnstile?.reset();
      } catch {
        // ignorar
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          "Error de red al enviar el formulario. Verifica tu conexión e inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      {/* Script de Turnstile con onload explícito */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit"
        strategy="afterInteractive"
      />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
          )}
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
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
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
          {fieldErrors.phone && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
          )}
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
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>
          )}
        </div>

        {/* Honeypot oculto */}
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Turnstile widget renderizado explícitamente */}
        <div className="mt-2">
          {siteKey ? (
            <div id="turnstile-widget" />
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
