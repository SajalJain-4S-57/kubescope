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

export default function CostExplorer() {
  const [drillState, setDrillState] = useState<DrillState>(initialDrillState);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

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
    { label: "Cluster", level: "cluster" },
    ...(drillState.selectedCluster
      ? [{ label: drillState.selectedCluster, level: "namespace" as DrillLevel }]
      : []),
    ...(drillState.selectedNamespace
      ? [{ label: drillState.selectedNamespace, level: "pod" as DrillLevel }]
      : []),
  ];

  const handleDrill = useCallback((row: CostRow) => {
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
  }, [drillState.level]);

  const handleBreadcrumbClick = useCallback((level: DrillLevel) => {
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

  return (
    <div
      className="cost-explorer-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.xl,
      }}
    >
      {/* Header with breadcrumbs */}
      <DrillHeader
        level={drillState.level}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
      />

      {/* Main content area */}
      <div
        style={{
          display: "flex",
          gap: tokens.spacing.xl,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Chart + Table */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          {/* Loading state */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.md,
                padding: tokens.spacing.xl,
                alignItems: "center",
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  style={{
                    height: "48px",
                    borderRadius: tokens.radius.md,
                    backgroundColor: tokens.colors.bgSecondary,
                    width: "100%",
                  }}
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div
              style={{
                padding: tokens.spacing.xl,
                textAlign: "center",
                color: tokens.colors.accentError,
                fontSize: tokens.font.md,
              }}
              role="alert"
            >
              Failed to load cost data. Please try again.
            </div>
          )}

          {/* Success state */}
          {!isLoading && !isError && data && (
            <AnimatePresence mode="wait">
              <motion.div
                key={drillState.level + (drillState.selectedCluster ?? "") + (drillState.selectedNamespace ?? "")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
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

        {/* Insight Panel — only at pod level */}
        {!isLoading && !isError && data && (
          <InsightPanel
            rows={data}
            visible={isLeafLevel}
          />
        )}
      </div>

      {/* Drill hint */}
      <AnimatePresence>
        {!isLeafLevel && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: tokens.font.sm,
              color: tokens.colors.textMuted,
              textAlign: "center",
              paddingBottom: tokens.spacing.md,
            }}
          >
            Click any bar or row to drill down →
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}