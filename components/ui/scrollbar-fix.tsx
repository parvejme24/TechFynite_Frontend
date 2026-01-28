"use client";

import { useEffect } from "react";

export function ScrollbarFix() {
  useEffect(() => {
    // Override any inline styles that hide scrollbars
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const target = mutation.target as HTMLElement;
          if (target === document.body && target.style.overflow === "hidden") {
            // Force scrollbar to remain visible
            target.style.overflow = "scroll";
            target.style.paddingRight = "0px";
          }
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}












