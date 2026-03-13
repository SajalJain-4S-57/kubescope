"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { CostRow } from "@/lib/types";
import { findMostWasteful, calculateSavings } from "@/lib/dataMapper";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface InsightPanelProps {
  rows: CostRow[];
  visible: boolean;
}

const TERMINAL_LINES = [
  "scanning pod metrics...",
  "analyzing efficiency...",
  "detecting anomalies...",
  "calculating waste...",
];

export default function InsightPanel({ rows, visible }: InsightPanelProps) {
  const wasteful = findMostWasteful(rows);
  const savings = calculateSavings(wasteful);
  const wastePercent = 100 - wasteful.efficiency;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          aria-label="Efficiency insight panel"
          style={{
            width: "260px",
            flexShrink: 0,
            alignSelf: "flex-start",
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.sm,
          }}
        >
          {/* Terminal window */}
          <div
            style={{
              backgroundColor: "#050810",
              border: `1px solid ${tokens.colors.borderStrong}`,
              borderRadius: tokens.radius.lg,
              overflow: "hidden",
              boxShadow: `0 0 40px color-mix(in srgb, ${tokens.colors.accentSuccess} 8%, transparent)`,
            }}
          >
            {/* Terminal title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.sm,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                borderBottom: `1px solid ${tokens.colors.border}`,
                backgroundColor: tokens.colors.bgSecondary,
              }}
            >
              {/* Traffic lights */}
              {[
                tokens.colors.accentError,
                tokens.colors.accentWarning,
                tokens.colors.accentSuccess,
              ].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: tokens.radius.full,
                    backgroundColor: color,
                    opacity: 0.8,
                  }}
                />
              ))}
              <span
                style={{
                  fontSize: tokens.font.xs,
                  color: tokens.colors.textMuted,
                  fontFamily: tokens.font.mono,
                  marginInlineStart: tokens.spacing.xs,
                  letterSpacing: "0.04em",
                }}
              >
                waste-analyzer
              </span>
            </div>

            {/* Terminal body */}
            <div
              style={{
                padding: tokens.spacing.md,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.xs,
                minHeight: "140px",
              }}
            >
              {/* Animated terminal lines */}
              {TERMINAL_LINES.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.18, duration: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: tokens.spacing.xs,
                  }}
                >
                  <span
                    style={{
                      color: tokens.colors.accentSuccess,
                      fontFamily: tokens.font.mono,
                      fontSize: tokens.font.xs,
                    }}
                  >
                    $
                  </span>
                  <span
                    style={{
                      color: tokens.colors.textMuted,
                      fontFamily: tokens.font.mono,
                      fontSize: tokens.font.xs,
                    }}
                  >
                    {line}
                  </span>
                </motion.div>
              ))}

              {/* Result line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: TERMINAL_LINES.length * 0.18 + 0.2 }}
                style={{
                  marginTop: tokens.spacing.sm,
                  paddingTop: tokens.spacing.sm,
                  borderTop: `1px solid ${tokens.colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: tokens.spacing.xs,
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    color: tokens.colors.accentError,
                    fontFamily: tokens.font.mono,
                    fontSize: tokens.font.xs,
                    fontWeight: 700,
                  }}
                >
                  ⚠
                </motion.span>
                <span
                  style={{
                    color: tokens.colors.accentError,
                    fontFamily: tokens.font.mono,
                    fontSize: tokens.font.xs,
                    fontWeight: 700,
                  }}
                >
                  WASTE DETECTED
                </span>
              </motion.div>
            </div>
          </div>

          {/* Wasteful pod card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            style={{
              backgroundColor: tokens.colors.bgCard,
              border: `1px solid color-mix(in srgb, ${tokens.colors.accentError} 30%, ${tokens.colors.border})`,
              borderRadius: tokens.radius.lg,
              padding: tokens.spacing.md,
              display: "flex",
              flexDirection: "column",
              gap: tokens.spacing.sm,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, color-mix(in srgb, ${tokens.colors.accentError} 10%, transparent), transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: tokens.font.xs,
                  color: tokens.colors.textMuted,
                  fontFamily: tokens.font.mono,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Most Wasteful
              </span>
              <span
                style={{
                  fontSize: tokens.font.xs,
                  color: tokens.colors.accentError,
                  fontFamily: tokens.font.mono,
                  fontWeight: 700,
                  backgroundColor: `color-mix(in srgb, ${tokens.colors.accentError} 10%, transparent)`,
                  padding: `2px ${tokens.spacing.sm}`,
                  borderRadius: tokens.radius.full,
                }}
              >
                {wastePercent}% waste
              </span>
            </div>

            <span
              style={{
                fontSize: tokens.font.lg,
                fontWeight: 800,
                color: tokens.colors.textPrimary,
                fontFamily: tokens.font.mono,
                letterSpacing: "-0.02em",
              }}
            >
              {wasteful.name}
            </span>

            {/* Waste bar */}
            <div
              style={{
                height: "4px",
                backgroundColor: tokens.colors.bgSecondary,
                borderRadius: tokens.radius.full,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${wastePercent}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                style={{
                  height: "100%",
                  backgroundColor: tokens.colors.accentError,
                  borderRadius: tokens.radius.full,
                  boxShadow: `0 0 8px ${tokens.colors.accentError}`,
                }}
              />
            </div>
          </motion.div>

          {/* Savings card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, type: "spring", stiffness: 200 }}
            style={{
              backgroundColor: tokens.colors.bgCard,
              border: `1px solid ${tokens.colors.borderGlow}`,
              borderRadius: tokens.radius.lg,
              padding: tokens.spacing.md,
              display: "flex",
              flexDirection: "column",
              gap: tokens.spacing.sm,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top glow line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "20%",
                right: "20%",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${tokens.colors.accentSuccess}, transparent)`,
              }}
            />

            <span
              style={{
                fontSize: tokens.font.xs,
                color: tokens.colors.textMuted,
                fontFamily: tokens.font.mono,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Est. Monthly Savings
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: tokens.spacing.xs,
              }}
            >
              <AnimatedNumber
                value={savings}
                prefix="$"
                style={{
                  fontSize: tokens.font.xxl,
                  fontWeight: 900,
                  color: tokens.colors.accentSuccess,
                  fontFamily: tokens.font.mono,
                  textShadow: `0 0 20px ${tokens.colors.accentGlow}`,
                  letterSpacing: "-0.03em",
                }}
              />
              <span
                style={{
                  fontSize: tokens.font.sm,
                  color: tokens.colors.textMuted,
                  fontFamily: tokens.font.mono,
                }}
              >
                /mo
              </span>
            </div>

            {/* Optimize button */}
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 20px ${tokens.colors.accentGlow}`,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: tokens.colors.accentSuccess,
                color: "#080B14",
                border: "none",
                borderRadius: tokens.radius.md,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                fontSize: tokens.font.sm,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: tokens.font.mono,
                letterSpacing: "0.04em",
                marginTop: tokens.spacing.xs,
              }}
              aria-label={`Optimize ${wasteful.name}`}
            >
              OPTIMIZE NOW →
            </motion.button>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}