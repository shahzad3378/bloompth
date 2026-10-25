"use client";

import { useEffect } from "react";

export default function ScrollAwareNavigation() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-scroll-hide-header]");
    if (!header) return;

    const isCompactViewport = () => window.innerWidth < 1024;
    let previousY = window.scrollY;

    const show = () => {
      header.style.transform = "";
      header.style.opacity = "";
      header.style.pointerEvents = "";
    };

    const hide = () => {
      header.style.transform = "translateY(-100%)";
      header.style.opacity = "0";
      header.style.pointerEvents = "none";
    };

    const readScrollY = () =>
      Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);

    const handleScroll = () => {
      const currentY = readScrollY();
      if (!isCompactViewport() || currentY <= 32) {
        show();
        previousY = currentY;
        return;
      }

      const delta = currentY - previousY;
      previousY = currentY;
      if (delta > 0) hide();
      else if (delta < 0) show();
    };

    const handleResize = () => {
      previousY = readScrollY();
      if (!isCompactViewport()) show();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      show();
    };
  }, []);

  return null;
}
