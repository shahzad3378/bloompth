"use client";

import { useEffect } from "react";

export default function ScrollAwareNavigation() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-scroll-hide-nav]");
    if (!nav) return;

    const mobileViewport = window.matchMedia("(max-width: 767px)");
    let previousY = window.scrollY;
    let direction = 0;
    let directionDistance = 0;

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
        previousY = currentY;
        return;
      }

      const delta = currentY - previousY;
      previousY = currentY;
      if (delta === 0) return;

      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) {
        direction = nextDirection;
        directionDistance = Math.abs(delta);
      } else {
        directionDistance += Math.abs(delta);
      }

      if (currentY < 64) {
        show();
        directionDistance = 0;
      } else if (direction < 0 && directionDistance >= 8) {
        show();
      } else if (direction > 0 && directionDistance >= 14 && currentY > 120) {
        hide();
      }
    };

    const handleViewportChange = () => {
      previousY = window.scrollY;
      direction = 0;
      directionDistance = 0;
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
