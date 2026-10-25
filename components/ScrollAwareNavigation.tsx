"use client";

import { useEffect } from "react";

export default function ScrollAwareNavigation() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-scroll-hide-nav]");
    if (!nav) return;

    const mobileViewport = window.matchMedia("(max-width: 767px)");
    let previousY = window.scrollY;

    const show = () => {
      nav.style.maxHeight = "";
      nav.style.opacity = "";
      nav.style.transform = "";
      nav.style.pointerEvents = "";
    };

    const hide = () => {
      nav.style.maxHeight = "0px";
      nav.style.opacity = "0";
      nav.style.transform = "translateY(-8px)";
      nav.style.pointerEvents = "none";
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!mobileViewport.matches) {
        show();
      } else if (currentY < 64 || currentY < previousY - 8) {
        show();
      } else if (currentY > 120 && currentY > previousY + 8) {
        hide();
      }
      previousY = currentY;
    };

    const handleViewportChange = () => {
      previousY = window.scrollY;
      if (!mobileViewport.matches) show();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    mobileViewport.addEventListener("change", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mobileViewport.removeEventListener("change", handleViewportChange);
      show();
    };
  }, []);

  return null;
}
