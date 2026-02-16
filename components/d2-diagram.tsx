"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const SAFE_NAME = /^[a-zA-Z0-9_-]+$/;

export function D2Diagram({ name }: { name: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!SAFE_NAME.test(name)) return null;

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const src = `/diagrams/${name}-${theme}.svg`;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} architecture diagram`}
        className="w-full"
        loading="lazy"
      />
    </div>
  );
}
