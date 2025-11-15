"use client";

import { useState } from "react";

const BRAND = "#2E7D32";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNote(null);

    if (!form.name.trim()) return setNote("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setNote("Enter a valid email.");
    if (form.message.trim().length < 10)
      return setNote("Message is too short.");

    setLoading(true);

    try {
      const res = await fetch("/api/new-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setNote("Thank you! We’ll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setNote(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
      noValidate
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          style={{ borderColor: BRAND }}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          style={{ borderColor: BRAND }}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          style={{ borderColor: BRAND }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md px-6 py-2 text-white font-semibold transition disabled:opacity-60"
        style={{ backgroundColor: BRAND }}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {note && <p className="text-sm text-gray-700 mt-2">{note}</p>}
    </form>
  );
}
