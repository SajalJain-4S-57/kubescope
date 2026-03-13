"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { DrillLevel, BreadcrumbItem } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface DrillHeaderProps {
  level: DrillLevel;
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (level: DrillLevel) => void;
  timeRange?: string;
}

const levelLabels: Record<DrillLevel, string> = {
  cluster: "Cluster",
  namespace: "Namespace",
  pod: "Pod",
};

const aggregationLabels: Record<DrillLevel, string> = {
  cluster: "Aggregated by: Cluster",
  namespace: "Aggregated by: Namespace",
  pod: "Aggregated by: Pod",
};

export default function DrillHeader({
  level,
  breadcrumbs,
  onBreadcrumbClick,
  timeRange = "Last 30 Days",
}: DrillHeaderProps) {
  const breadcrumbLabel = breadcrumbs
    .map((b) => levelLabels[b.level])
    .join(" → ");

  const pillLabel =
    breadcrumbs.length > 1
      ? breadcrumbs.map((b) => b.label).join(" — ")
      : levelLabels[level];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: tokens.spacing.md,
        flexWrap: "wrap",
        marginBottom: tokens.spacing.xl,
      }}
    >
      {/* Time range badge */}
      <Badge label={timeRange} variant="default" size="md" />

      {/* Drill path pill + aggregation tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level + pillLabel}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.xs }}
        >
          {/* Green breadcrumb pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.spacing.xs,
              backgroundColor: tokens.colors.accentSuccess,
              color: tokens.colors.bgPrimary,
              borderRadius: tokens.radius.full,
              padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
              fontWeight: 700,
              fontSize: tokens.font.md,
              cursor: "default",
            }}
          >
            {/* Clickable breadcrumb segments */}
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.level} style={{ display: "inline-flex", alignItems: "center", gap: tokens.spacing.xs }}>
                {index > 0 && (
                  <span style={{ opacity: 0.7, fontWeight: 400 }}>—</span>
                )}
                <span
                  onClick={() => onBreadcrumbClick(crumb.level)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onBreadcrumbClick(crumb.level);
                    }
                  }}
                  style={{
                    cursor: index < breadcrumbs.length - 1 ? "pointer" : "default",
                    textDecoration: index < breadcrumbs.length - 1 ? "underline" : "none",
                    textDecorationStyle: "dotted",
                    opacity: index < breadcrumbs.length - 1 ? 0.85 : 1,
                  }}
                  aria-label={`Navigate back to ${crumb.label}`}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>

          {/* Aggregation label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              backgroundColor: tokens.colors.bgCard,
              border: `1px solid ${tokens.colors.accentSuccess}`,
              borderRadius: tokens.radius.sm,
              padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
              fontSize: tokens.font.sm,
              color: tokens.colors.textSecondary,
              marginInlineStart: tokens.spacing.sm,
            }}
          >
            <span style={{ color: tokens.colors.textMuted }}>
              Aggregated by:{" "}
            </span>
            <strong style={{ color: tokens.colors.textPrimary }}>
              {levelLabels[level]}
            </strong>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}