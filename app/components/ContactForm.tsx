"use client";

import { FormEvent, useState } from "react";
import Script from "next/script";
import { contactSchema } from "../lib/validation/contact";

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
};

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // 🔍 LOG 1: ver qué siteKey llega al cliente
  console.log("Turnstile siteKey (cliente):", siteKey);

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

    const tokenInput = document.querySelector(
      'input[name="cf-turnstile-response"]'
    ) as HTMLInputElement | null;

    const turnstileToken = tokenInput?.value || "";

    // 🔍 LOG 2: ver si el input existe y qué valor tiene
    console.log("Turnstile token input:", tokenInput);
    console.log("Turnstile token value:", turnstileToken);

    if (!turnstileToken) {
      setStatus({
        type: "error",
        message: "Por favor completa la verificación anti-bots.",
      });
      return;
    }

    const parsed = contactSchema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });

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
          ...parsed.data,
          turnstileToken,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

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
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* ... TODO LO DEMÁS IGUAL ... */}

        <div className="mt-2">
          {siteKey ? (
            <div className="cf-turnstile" data-sitekey={siteKey} />
          ) : (
            <p className="text-xs text-red-600">
              Falta configurar NEXT_PUBLIC_TURNSTILE_SITE_KEY.
            </p>
          )}
        </div>

        {/* resto del formulario igual */}
      </form>
    </div>
  );
}
