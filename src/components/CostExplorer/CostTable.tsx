"use client";

import { motion } from "framer-motion";
import { tokens } from "@/tokens";
import { CostRow } from "@/lib/types";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface CostTableProps {
  rows: CostRow[];
  onRowClick: (row: CostRow) => void;
  activeId?: string;
  isLeafLevel?: boolean;
}

const columns = [
  { key: "cpu", label: "CPU", secondary: false },
  { key: "ram", label: "RAM", secondary: false },
  { key: "storage", label: "Storage", secondary: true },
  { key: "network", label: "Network", secondary: true },
  { key: "gpu", label: "GPU", secondary: true },
  { key: "efficiency", label: "Efficiency", secondary: false },
  { key: "total", label: "Total", secondary: false },
];

export default function CostTable({
  rows,
  onRowClick,
  activeId,
  isLeafLevel = false,
}: CostTableProps) {
  return (
    <div
      style={{
        overflowX: "auto",
        marginTop: tokens.spacing.lg,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: tokens.font.md,
        }}
        role="table"
        aria-label="Resource cost breakdown table"
      >
        {/* Header */}
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                color: tokens.colors.textMuted,
                fontWeight: 500,
                fontSize: tokens.font.sm,
                borderBottom: `1px solid ${tokens.colors.border}`,
              }}
            >
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  col.secondary ? "cost-table-cell--secondary" : undefined
                }
                style={{
                  textAlign: "right",
                  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                  color: tokens.colors.textMuted,
                  fontWeight: 500,
                  fontSize: tokens.font.sm,
                  borderBottom: `1px solid ${tokens.colors.border}`,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, index) => {
            const isActive = activeId === row.id;
            const isClickable = !isLeafLevel;

            return (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                onClick={() => isClickable && onRowClick(row)}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
                aria-label={
                  isClickable ? `Drill into ${row.name}` : row.name
                }
                style={{
                  cursor: isClickable ? "pointer" : "default",
                  backgroundColor: isActive
                    ? tokens.colors.accentSuccessLight
                    : "transparent",
                  borderRadius: tokens.radius.sm,
                  transition: `background-color ${tokens.transition.fast}`,
                }}
                whileHover={
                  isClickable
                    ? { backgroundColor: tokens.colors.bgCardHover }
                    : {}
                }
              >
                {/* Row name */}
                <td
                  style={{
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    fontWeight: 600,
                    color: tokens.colors.textPrimary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.name}
                </td>

                {/* CPU */}
                <td
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    color: tokens.colors.textSecondary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <AnimatedNumber value={row.cpu} prefix="$" />
                </td>

                {/* RAM */}
                <td
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    color: tokens.colors.textSecondary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <AnimatedNumber value={row.ram} prefix="$" />
                </td>

                {/* Storage - secondary (hidden on small containers) */}
                <td
                  className="cost-table-cell--secondary"
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    color: tokens.colors.textSecondary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <AnimatedNumber value={row.storage} prefix="$" />
                </td>

                {/* Network - secondary */}
                <td
                  className="cost-table-cell--secondary"
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    color: tokens.colors.textSecondary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <AnimatedNumber value={row.network} prefix="$" />
                </td>

                {/* GPU - secondary */}
                <td
                  className="cost-table-cell--secondary"
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    color: tokens.colors.textSecondary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <AnimatedNumber value={row.gpu} prefix="$" />
                </td>

                {/* Efficiency */}
                <td
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <span
                    style={{
                      color:
                        row.efficiency >= 50
                          ? tokens.colors.accentSuccess
                          : row.efficiency >= 25
                          ? tokens.colors.accentWarning
                          : tokens.colors.accentError,
                      fontWeight: 500,
                    }}
                  >
                    <AnimatedNumber value={row.efficiency} suffix="%" />
                  </span>
                </td>

                {/* Total */}
                <td
                  style={{
                    textAlign: "right",
                    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
                    fontWeight: 700,
                    color: tokens.colors.textPrimary,
                    borderBottom: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <AnimatedNumber value={row.total} prefix="$" />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}