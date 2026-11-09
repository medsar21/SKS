"use client";

import { useEffect, useState } from "react";
import { BrandLoading } from "@/components/brand-loading";

export function BrandIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 1700);
    return () => window.clearTimeout(timeout);
  }, []);

  return visible ? <BrandLoading intro /> : null;
}
