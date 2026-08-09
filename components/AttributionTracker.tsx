"use client";

import { useEffect } from "react";

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export default function AttributionTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    let foundTracking = false;

    TRACKING_KEYS.forEach((key) => {
      const value = params.get(key);

      if (value) {
        localStorage.setItem(`attribution_${key}`, value);
        foundTracking = true;
      }
    });

    const utmSource = params.get("utm_source");

    if (utmSource) {
      localStorage.setItem(
        "attribution_source_platform",
        utmSource.toLowerCase()
      );
    } else if (params.get("fbclid")) {
      localStorage.setItem(
        "attribution_source_platform",
        "meta"
      );
    } else if (!localStorage.getItem("attribution_source_platform")) {
      localStorage.setItem(
        "attribution_source_platform",
        "direct"
      );
    }

    if (foundTracking) {
      localStorage.setItem(
        "attribution_first_seen_at",
        new Date().toISOString()
      );
    }
  }, []);

  return null;
}
