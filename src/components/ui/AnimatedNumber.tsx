"use client";

import { useEffect, useRef, useState } from "react";
import { tokens } from "@/tokens";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  style?: React.CSSProperties;
}

export default function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1000,
  style,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }

    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(
        startValueRef.current + (value - startValueRef.current) * eased
      );

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formattedValue = displayValue.toLocaleString();

  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        color: tokens.colors.textPrimary,
        ...style,
      }}
      aria-live="polite"
      aria-label={`${prefix}${value.toLocaleString()}${suffix}`}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}