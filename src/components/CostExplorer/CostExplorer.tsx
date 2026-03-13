"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { DrillLevel, DrillState, BreadcrumbItem, CostRow } from "@/lib/types";
import { useCostData } from "@/hooks/useCostData";
import DrillHeader from "./DrillHeader";
import BarChart from "./BarChart";
import CostTable from "./CostTable";
import InsightPanel from "./InsightPanel";

const initialDrillState: DrillState = {
  level: "cluster",
  selectedCluster: null,
  selectedNamespace: null,
};

const levelTransitions: Record<DrillLevel, { scale: number; blur: string }> = {
  cluster: { scale: 1, blur: "0px" },
  namespace: { scale: 0.98, blur: "0px" },
  pod: { scale: 0.96, blur: "0px" },
};

export default function CostExplorer() {
  const [drillState, setDrillState] = useState<DrillState>(initialDrillState);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [drillDirection, setDrillDirection] = useState<"in" | "out">("in");

  const { data, isLoading, isError } = useCostData({
    level: drillState.level,
    parentName:
      drillState.level === "pod"
        ? drillState.selectedNamespace ?? ""
        : drillState.level === "namespace"
        ? drillState.selectedCluster ?? ""
        : "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "All Clusters", level: "cluster" },
    ...(drillState.selectedCluster
      ? [{ label: drillState.selectedCluster, level: "namespace" as DrillLevel }]
      : []),
    ...(drillState.selectedNamespace
      ? [{ label: drillState.selectedNamespace, level: "pod" as DrillLevel }]
      : []),
  ];

  const handleDrill = useCallback(
    (row: CostRow) => {
      setDrillDirection("in");
      setActiveRowId(row.id);

      if (drillState.level === "cluster") {
        setDrillState({
          level: "namespace",
          selectedCluster: row.name,
          selectedNamespace: null,
        });
      } else if (drillState.level === "namespace") {
        setDrillState((prev) => ({
          ...prev,
          level: "pod",
          selectedNamespace: row.name,
        }));
      }
    },
    [drillState.level]
  );

  const handleBreadcrumbClick = useCallback((level: DrillLevel) => {
    setDrillDirection("out");
    if (level === "cluster") {
      setDrillState(initialDrillState);
      setActiveRowId(null);
    } else if (level === "namespace") {
      setDrillState((prev) => ({
        ...prev,
        level: "namespace",
        selectedNamespace: null,
      }));
      setActiveRowId(null);
    }
  }, []);

  const isLeafLevel = drillState.level === "pod";
  const compositeKey =
    drillState.level +
    (drillState.selectedCluster ?? "") +
    (drillState.selectedNamespace ?? "");

  return (
    <div
      className="cost-explorer-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.xl,
      }}
    >
      {/* Drill Header */}
      <DrillHeader
        level={drillState.level}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
      />

      {/* Level indicator dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.sm,
        }}
      >
        {(["cluster", "namespace", "pod"] as DrillLevel[]).map((l) => (
          <motion.div
            key={l}
            animate={{
              width: drillState.level === l ? "24px" : "6px",
              backgroundColor:
                drillState.level === l
                  ? tokens.colors.accentSuccess
                  : tokens.colors.borderStrong,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              height: "6px",
              borderRadius: tokens.radius.full,
            }}
          />
        ))}
        <span
          style={{
            fontSize: tokens.font.xs,
            color: tokens.colors.textMuted,
            fontFamily: tokens.font.mono,
            marginInlineStart: tokens.spacing.xs,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {drillState.level}
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          gap: tokens.spacing.xl,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          {/* Loading skeleton */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.md,
              }}
            >
              {/* Bar skeleton */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: tokens.spacing.lg,
                  height: "200px",
                  padding: tokens.spacing.md,
                }}
              >
                {[80, 45, 30, 20].map((h, i) => (
                  <motion.div
                    key={i}
                    className="shimmer"
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: `${tokens.radius.md} ${tokens.radius.md} 0 0`,
                    }}
                  />
                ))}
              </div>
              {/* Row skeletons */}
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="shimmer"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  style={{
                    height: "48px",
                    borderRadius: tokens.radius.md,
                  }}
                />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
              style={{
                padding: tokens.spacing.xl,
                textAlign: "center",
                color: tokens.colors.accentError,
                fontSize: tokens.font.md,
                fontFamily: tokens.font.mono,
                border: `1px solid ${tokens.colors.accentError}`,
                borderRadius: tokens.radius.lg,
                backgroundColor: `color-mix(in srgb, ${tokens.colors.accentError} 5%, transparent)`,
              }}
            >
              ⚠ Failed to load cost data. Please try again.
            </motion.div>
          )}

          {/* Success */}
          {!isLoading && !isError && data && (
            <AnimatePresence mode="wait">
              <motion.div
                key={compositeKey}
                initial={{
                  opacity: 0,
                  scale: drillDirection === "in" ? 1.04 : 0.96,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: drillDirection === "in" ? 0.96 : 1.04,
                  filter: "blur(4px)",
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                <BarChart
                  rows={data}
                  onBarClick={handleDrill}
                  activeId={activeRowId ?? undefined}
                  isLeafLevel={isLeafLevel}
                />
                <CostTable
                  rows={data}
                  onRowClick={handleDrill}
                  activeId={activeRowId ?? undefined}
                  isLeafLevel={isLeafLevel}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Insight Panel */}
        {!isLoading && !isError && data && (
          <InsightPanel rows={data} visible={isLeafLevel} />
        )}
      </div>

      {/* Drill hint */}
      <AnimatePresence>
        {!isLeafLevel && !isLoading && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              fontSize: tokens.font.xs,
              color: tokens.colors.textMuted,
              textAlign: "center",
              fontFamily: tokens.font.mono,
              letterSpacing: "0.06em",
              paddingBottom: tokens.spacing.sm,
            }}
          >
            ↑ CLICK ANY BAR OR ROW TO DRILL DOWN
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}