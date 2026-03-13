"use client";

import { motion } from "framer-motion";
import { tokens } from "@/tokens";
import { CostRow } from "@/lib/types";

interface BarChartProps {
  rows: CostRow[];
  onBarClick: (row: CostRow) => void;
  activeId?: string;
  isLeafLevel?: boolean;
}

const CHART_HEIGHT = 180;

export default function BarChart({
  rows,
  onBarClick,
  activeId,
  isLeafLevel = false,
}: BarChartProps) {
  const maxTotal = Math.max(...rows.map((r) => r.total));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "clamp(1rem, 4vw, 3rem)",
        height: `${CHART_HEIGHT + 40}px`,
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        borderBottom: `1px dashed ${tokens.colors.border}`,
        position: "relative",
      }}
      role="img"
      aria-label="Cost comparison bar chart"
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <div
          key={ratio}
          style={{
            position: "absolute",
            left: tokens.spacing.lg,
            right: tokens.spacing.lg,
            bottom: `${40 + ratio * CHART_HEIGHT}px`,
            borderTop: `1px dashed ${tokens.colors.border}`,
            pointerEvents: "none",
          }}
        />
      ))}

      {rows.map((row, index) => {
        const heightRatio = row.total / maxTotal;
        const barHeight = Math.max(heightRatio * CHART_HEIGHT, 8);
        const isActive = activeId === row.id;
        const isClickable = !isLeafLevel;

        return (
          <div
            key={row.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: tokens.spacing.sm,
              flex: 1,
              maxWidth: "120px",
            }}
          >
            {/* Bar */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: barHeight,
                opacity: 1,
                scale: isActive ? 1.05 : 1,
              }}
              transition={{
                height: {
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  delay: index * 0.08,
                },
                opacity: { duration: 0.3, delay: index * 0.08 },
                scale: { type: "spring", stiffness: 300, damping: 25 },
              }}
              whileHover={
                isClickable
                  ? {
                      scale: 1.08,
                      filter: "brightness(1.1)",
                    }
                  : {}
              }
              whileTap={isClickable ? { scale: 0.97 } : {}}
              onClick={() => isClickable && onBarClick(row)}
              style={{
                width: "100%",
                backgroundColor: isActive
                  ? tokens.colors.accentPrimary
                  : tokens.colors.accentSuccess,
                borderRadius: `${tokens.radius.md} ${tokens.radius.md} 0 0`,
                cursor: isClickable ? "pointer" : "default",
                boxShadow: isActive
                  ? `0 0 20px color-mix(in srgb, ${tokens.colors.accentSuccess} 40%, transparent)`
                  : "none",
                transformOrigin: "bottom",
              }}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={
                isClickable ? `Drill into ${row.name}` : row.name
              }
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onBarClick(row);
                }
              }}
            />

            {/* Label */}
            <span
              style={{
                fontSize: tokens.font.sm,
                color: tokens.colors.textSecondary,
                textAlign: "center",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {row.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}