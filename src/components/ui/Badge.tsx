"use client";

import { tokens } from "@/tokens";

interface BadgeProps {
  label: string;
  variant?: "default" | "accent" | "success" | "muted";
  size?: "sm" | "md";
  onClick?: () => void;
  active?: boolean;
}

export default function Badge({
  label,
  variant = "default",
  size = "md",
  onClick,
  active = false,
}: BadgeProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.full,
    fontWeight: 500,
    cursor: onClick ? "pointer" : "default",
    transition: tokens.transition.base,
    border: "1px solid transparent",
    whiteSpace: "nowrap" as const,
    fontSize: size === "sm" ? tokens.font.sm : tokens.font.md,
    padding:
      size === "sm"
        ? `${tokens.spacing.xs} ${tokens.spacing.sm}`
        : `${tokens.spacing.sm} ${tokens.spacing.md}`,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: active
        ? tokens.colors.accentSuccess
        : tokens.colors.bgCard,
      color: active
        ? tokens.colors.bgPrimary
        : tokens.colors.textPrimary,
      border: `1px solid ${active ? tokens.colors.accentSuccess : tokens.colors.border}`,
    },
    accent: {
      backgroundColor: tokens.colors.accentPrimary,
      color: "#ffffff",
    },
    success: {
      backgroundColor: tokens.colors.accentSuccessLight,
      color: tokens.colors.accentSuccess,
      border: `1px solid ${tokens.colors.accentSuccess}`,
    },
    muted: {
      backgroundColor: tokens.colors.bgSecondary,
      color: tokens.colors.textMuted,
    },
  };

  return (
    <span
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={onClick ? active : undefined}
    >
      {label}
    </span>
  );
}