"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/contact/actions";
import Button from "@/components/ui/Button";
import type { FormState } from "@/types";

const SERVICE_OPTIONS = [
  "Chip Repair",
  "Crack Repair",
  "Fleet & Commercial",
  "Assessment",
] as const;

const initialState: FormState = {
  success: false,
  message: "",
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            state.success
              ? "bg-green-900/30 text-green-400 border border-green-800"
              : "bg-red/10 text-red-light border border-red/30"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        className="absolute -left-[9999px] opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-300">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-300">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="(501) 555-0123"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceType" className="mb-1 block text-sm font-medium text-zinc-300">
            Service Type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="vehicleInfo" className="mb-1 block text-sm font-medium text-zinc-300">
            Vehicle (Year, Make, Model)
          </label>
          <input
            type="text"
            id="vehicleInfo"
            name="vehicleInfo"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="e.g. 2022 Toyota Camry"
          />
        </div>
      </div>

      <div>
        <label htmlFor="damageDescription" className="mb-1 block text-sm font-medium text-zinc-300">
          Describe the Damage
        </label>
        <textarea
          id="damageDescription"
          name="damageDescription"
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          placeholder="Tell us about the chip, crack, or damage..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Preferred Contact Method
        </label>
        <div className="flex gap-4">
          {(["phone", "email", "text"] as const).map((method) => (
            <label key={method} className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="radio"
                name="preferredContact"
                value={method}
                defaultChecked={method === "phone"}
                className="accent-blue-600"
              />
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
