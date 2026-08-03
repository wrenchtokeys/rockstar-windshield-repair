"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile — the free, mostly-invisible captcha. Rendered
// explicitly (not via the auto-scan) so it survives client-side
// navigation back to the contact page. When it sits inside a <form>, the
// widget injects a hidden cf-turnstile-response input that the server
// action verifies.

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/api.js?onload=onTurnstileLoad&render=explicit";

export default function TurnstileWidget({ siteKey }: { siteKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const render = () => {
      if (widgetId.current || !window.turnstile || !el.isConnected) return;
      widgetId.current = window.turnstile.render(el, {
        sitekey: siteKey,
        theme: "dark",
      });
    };

    if (window.turnstile) {
      render();
    } else {
      window.onTurnstileLoad = render;
      if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey]);

  return <div ref={ref} />;
}
