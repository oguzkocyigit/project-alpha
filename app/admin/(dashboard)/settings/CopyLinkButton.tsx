"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — ignore, the link is still selectable as text
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm text-muted hover:text-foreground"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Kopyalandı" : "Kopyala"}
    </button>
  );
}
