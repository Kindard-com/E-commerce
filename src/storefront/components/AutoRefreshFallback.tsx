"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefreshFallback({ isFallback }: { isFallback: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (isFallback) {
      const interval = setInterval(() => {
        router.refresh();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isFallback, router]);

  if (!isFallback) return null;

  return (
    <div style={{ textAlign: "center", padding: "10px", background: "var(--accent)", color: "var(--black)", fontSize: "12px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
      Connecting to Medusa backend... Catalog will refresh automatically.
    </div>
  );
}
