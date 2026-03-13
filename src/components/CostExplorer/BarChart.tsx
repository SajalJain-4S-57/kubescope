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

const CHART_HEIGHT = 200;

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
        gap: "clamp(0.75rem, 3vw, 2.5rem)",
        height: `${CHART_HEIGHT + 60}px`,
        padding: `${tokens.spacing.md} ${tokens.spacing.lg} 0`,
        position: "relative",
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}
      role="img"
      aria-label="Cost comparison bar chart"
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <motion.div
          key={ratio}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: ratio * 0.15 }}
          style={{
            position: "absolute",
            left: tokens.spacing.lg,
            right: tokens.spacing.lg,
            bottom: `${60 + ratio * CHART_HEIGHT}px`,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${tokens.colors.border}, transparent)`,
            transformOrigin: "left",
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
              maxWidth: "140px",
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            {/* Cost label above bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              style={{
                fontSize: tokens.font.xs,
                fontFamily: tokens.font.mono,
                color: isActive
                  ? tokens.colors.accentSuccess
                  : tokens.colors.textMuted,
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              ${row.total.toLocaleString()}
            </motion.div>

            {/* Bar wrapper */}
            <div
              style={{
                width: "100%",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {/* Glow underneath active bar */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80%",
                    height: "20px",
                    background: `radial-gradient(ellipse, ${tokens.colors.accentSuccess} 0%, transparent 70%)`,
                    filter: "blur(8px)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* The actual bar */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: barHeight,
                  opacity: 1,
                }}
                transition={{
                  height: {
                    type: "spring",
                    stiffness: 100,
                    damping: 18,
                    delay: index * 0.08,
                  },
                  opacity: {
                    duration: 0.3,
                    delay: index * 0.08,
                  },
                }}
                whileHover={
                  isClickable
                    ? { scale: 1.06, filter: "brightness(1.2)" }
                    : {}
                }
                whileTap={isClickable ? { scale: 0.97 } : {}}
                onClick={() => isClickable && onBarClick(row)}
                style={{
                  width: "100%",
                  borderRadius: `${tokens.radius.md} ${tokens.radius.md} 0 0`,
                  cursor: isClickable ? "pointer" : "default",
                  transformOrigin: "bottom",
                  position: "relative",
                  overflow: "hidden",
                  background: isActive
                    ? `linear-gradient(180deg, 
                        color-mix(in srgb, ${tokens.colors.accentSuccess} 90%, white) 0%,
                        ${tokens.colors.accentSuccess} 100%)`
                    : `linear-gradient(180deg,
                        color-mix(in srgb, ${tokens.colors.accentSuccess} 70%, ${tokens.colors.accentPrimary}) 0%,
                        color-mix(in srgb, ${tokens.colors.accentSuccess} 50%, transparent) 100%)`,
                  boxShadow: isActive
                    ? `0 0 30px color-mix(in srgb, ${tokens.colors.accentSuccess} 40%, transparent),
                       inset 0 1px 0 color-mix(in srgb, white 30%, transparent)`
                    : `inset 0 1px 0 color-mix(in srgb, white 15%, transparent)`,
                }}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={isClickable ? `Drill into ${row.name}` : row.name}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onBarClick(row);
                  }
                }}
              >
                {/* Shimmer sweep on bar */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 3 + index * 0.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(
                      90deg,
                      transparent 0%,
                      color-mix(in srgb, white 20%, transparent) 50%,
                      transparent 100%
                    )`,
                    pointerEvents: "none",
                  }}
                />

                {/* Efficiency indicator stripe at bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    backgroundColor:
                      row.efficiency >= 50
                        ? tokens.colors.accentSuccess
                        : row.efficiency >= 25
                        ? tokens.colors.accentWarning
                        : tokens.colors.accentError,
                    opacity: 0.9,
                  }}
                />
              </motion.div>
            </div>

            {/* Label */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              style={{
                fontSize: tokens.font.sm,
                color: isActive
                  ? tokens.colors.accentSuccess
                  : tokens.colors.textSecondary,
                textAlign: "center",
                fontWeight: isActive ? 700 : 500,
                fontFamily: tokens.font.mono,
                letterSpacing: "0.02em",
                marginBottom: tokens.spacing.sm,
              }}
            >
              {row.name}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}