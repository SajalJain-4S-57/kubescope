"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { DrillLevel, BreadcrumbItem } from "@/lib/types";

interface DrillHeaderProps {
  level: DrillLevel;
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (level: DrillLevel) => void;
  timeRange?: string;
}

const levelConfig: Record<DrillLevel, { icon: string; color: string }> = {
  cluster: { icon: "◈", color: tokens.colors.accentSuccess },
  namespace: { icon: "◇", color: tokens.colors.accentPrimary },
  pod: { icon: "○", color: tokens.colors.accentWarning },
};

export default function DrillHeader({
  level,
  breadcrumbs,
  onBreadcrumbClick,
  timeRange = "Last 30 Days",
}: DrillHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.md,
      }}
    >
      {/* Top row — time range + level badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: tokens.spacing.sm,
        }}
      >
        {/* Time range */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: tokens.spacing.xs,
            border: `1px solid ${tokens.colors.borderStrong}`,
            borderRadius: tokens.radius.full,
            padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.bgCard,
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
            ◷
          </span>
          <span
            style={{
              fontSize: tokens.font.sm,
              color: tokens.colors.textSecondary,
              fontFamily: tokens.font.mono,
              fontWeight: 500,
            }}
          >
            {timeRange}
          </span>
        </div>

        {/* Current level badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              border: `1px solid ${tokens.colors.borderGlow}`,
              borderRadius: tokens.radius.full,
              padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
              backgroundColor: tokens.colors.accentSuccessLight,
            }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                fontSize: "14px",
                color: tokens.colors.accentSuccess,
                display: "inline-block",
              }}
            >
              {levelConfig[level].icon}
            </motion.span>
            <span
              style={{
                fontSize: tokens.font.sm,
                color: tokens.colors.accentSuccess,
                fontFamily: tokens.font.mono,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {level}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Breadcrumb path */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.xs,
          flexWrap: "wrap",
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isClickable = !isLast;

          return (
            <motion.div
              key={crumb.level}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: tokens.spacing.xs,
              }}
            >
              {/* Connector line */}
              {index > 0 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  style={{
                    width: "20px",
                    height: "1px",
                    backgroundColor: tokens.colors.borderStrong,
                    transformOrigin: "left",
                    marginInline: tokens.spacing.xs,
                  }}
                />
              )}

              {/* Crumb */}
              <motion.span
                onClick={() => isClickable && onBreadcrumbClick(crumb.level)}
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? "button" : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onBreadcrumbClick(crumb.level);
                  }
                }}
                whileHover={isClickable ? { color: tokens.colors.accentSuccess } : {}}
                aria-label={
                  isClickable ? `Navigate back to ${crumb.label}` : undefined
                }
                style={{
                  fontSize: tokens.font.sm,
                  fontFamily: tokens.font.mono,
                  fontWeight: isLast ? 700 : 400,
                  color: isLast
                    ? tokens.colors.textPrimary
                    : tokens.colors.textMuted,
                  cursor: isClickable ? "pointer" : "default",
                  transition: `color ${tokens.transition.fast}`,
                  letterSpacing: "0.02em",
                }}
              >
                {crumb.label}
              </motion.span>
            </motion.div>
          );
        })}

        {/* Aggregation label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={level + "agg"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            style={{
              marginInlineStart: tokens.spacing.sm,
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.spacing.xs,
              backgroundColor: tokens.colors.bgSecondary,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.sm,
              padding: `2px ${tokens.spacing.sm}`,
            }}
          >
            <span
              style={{
                fontSize: tokens.font.xs,
                color: tokens.colors.textMuted,
                fontFamily: tokens.font.mono,
              }}
            >
              agg:
            </span>
            <span
              style={{
                fontSize: tokens.font.xs,
                color: tokens.colors.accentSuccess,
                fontFamily: tokens.font.mono,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {level}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}