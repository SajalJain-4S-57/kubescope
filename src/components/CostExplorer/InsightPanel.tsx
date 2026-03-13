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

export default function InsightPanel({ rows, visible }: InsightPanelProps) {
  const wasteful = findMostWasteful(rows);
  const savings = calculateSavings(wasteful);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          aria-label="Efficiency insight panel"
          style={{
            backgroundColor: tokens.colors.bgCard,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.lg,
            padding: tokens.spacing.lg,
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.md,
            minWidth: "220px",
            maxWidth: "280px",
            alignSelf: "flex-start",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glowing background accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "120px",
              background: `radial-gradient(circle, color-mix(in srgb, ${tokens.colors.accentWarning} 20%, transparent) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
            }}
          >
            {/* Pulsing warning dot */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: tokens.radius.full,
                backgroundColor: tokens.colors.accentWarning,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: tokens.font.sm,
                fontWeight: 700,
                color: tokens.colors.textPrimary,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Waste Detected
            </span>
          </div>

          {/* Wasteful pod name */}
          <div
            style={{
              backgroundColor: tokens.colors.bgSecondary,
              borderRadius: tokens.radius.md,
              padding: tokens.spacing.md,
              border: `1px solid color-mix(in srgb, ${tokens.colors.accentWarning} 30%, ${tokens.colors.border})`,
            }}
          >
            <p
              style={{
                fontSize: tokens.font.sm,
                color: tokens.colors.textMuted,
                marginBottom: tokens.spacing.xs,
              }}
            >
              Most wasteful
            </p>
            <p
              style={{
                fontSize: tokens.font.lg,
                fontWeight: 700,
                color: tokens.colors.textPrimary,
              }}
            >
              {wasteful.name}
            </p>
            <p
              style={{
                fontSize: tokens.font.sm,
                color: tokens.colors.accentError,
                marginTop: tokens.spacing.xs,
                fontWeight: 500,
              }}
            >
              {wasteful.efficiency}% efficiency
            </p>
          </div>

          {/* Savings estimate */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: tokens.spacing.xs,
            }}
          >
            <p
              style={{
                fontSize: tokens.font.sm,
                color: tokens.colors.textMuted,
              }}
            >
              Estimated monthly savings
            </p>
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
                  fontSize: tokens.font.xl,
                  fontWeight: 800,
                  color: tokens.colors.accentSuccess,
                }}
              />
              <span
                style={{
                  fontSize: tokens.font.sm,
                  color: tokens.colors.textMuted,
                }}
              >
                / mo
              </span>
            </div>
          </div>

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              backgroundColor: tokens.colors.accentSuccess,
              color: tokens.colors.bgPrimary,
              border: "none",
              borderRadius: tokens.radius.md,
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              fontSize: tokens.font.sm,
              fontWeight: 600,
              cursor: "pointer",
              transition: tokens.transition.base,
            }}
            aria-label={`Optimize ${wasteful.name}`}
          >
            Optimize Now →
          </motion.button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}