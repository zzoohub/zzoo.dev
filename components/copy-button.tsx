"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export function CopyButton({
  text,
  label,
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("contact");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable in some contexts
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 text-sm font-medium transition-colors duration-150 hover:bg-muted"
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label ?? t("copy_address")}
        </>
      )}
    </button>
  );
}
