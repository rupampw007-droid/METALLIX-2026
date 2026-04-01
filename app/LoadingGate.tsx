"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const MIN_MS = 1800;

export default function LoadingGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Always render children in the background so they load/fetch */}
      <div style={{ visibility: ready ? "visible" : "hidden", position: ready ? "static" : "fixed" }}>
        {children}
      </div>

      {/* Overlay the loading screen until timer fires */}
      {!ready && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          <LoadingScreen />
        </div>
      )}
    </>
  );
}