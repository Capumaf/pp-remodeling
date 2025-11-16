// app/lib/validation/contact.ts
import { z } from "zod";

// ---------- Sanitización compartida ----------

function stripHtml(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function sanitizeText(input: string): string {
  let out = stripHtml(input);
  out = normalizeWhitespace(out);
  // elimina caracteres de control raros
  out = out.replace(/[^\x09\x0A\x0D\x20-\x7EÁÉÍÓÚáéíóúÑñüÜ¿¡]/g, "");
  return out;
}

// regex de teléfono (mismo criterio que usabas)
const phoneRegex = /^[0-9+\-()\s.]{7,20}$/;

// ---------- Esquema Zod compartido ----------

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .email("El correo electrónico no es válido.")
    .max(254, "El correo electrónico es demasiado largo."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "El teléfono no es válido."),
  message: z
    .string()
    .trim()
    .min(10, "El mensaje es demasiado corto.")
    .max(2000, "El mensaje es demasiado largo."),
  // honeypot (campo oculto en el formulario)
  company: z.string().optional(),
});

export type ContactData = z.infer<typeof contactSchema>;
