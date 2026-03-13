"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { tokens } from "@/tokens";
import CostExplorer from "@/components/CostExplorer/CostExplorer";

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.bgPrimary,
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${tokens.spacing.md} clamp(1rem, 5vw, 3rem)`,
          borderBottom: `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.bgCard,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.sm,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: tokens.radius.sm,
              backgroundColor: tokens.colors.accentSuccess,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: tokens.colors.bgPrimary,
                fontWeight: 800,
                fontSize: "14px",
              }}
            >
              K
            </span>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: tokens.font.lg,
              color: tokens.colors.textPrimary,
            }}
          >
            KubeScope
          </span>
        </div>

        {/* Dark mode toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{
            backgroundColor: tokens.colors.bgSecondary,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.full,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            cursor: "pointer",
            fontSize: tokens.font.sm,
            color: tokens.colors.textSecondary,
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.xs,
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </motion.button>
      </nav>

      {/* Hero */}
      <div
        className="section-padding"
        style={{
          textAlign: "center",
          borderBottom: `1px solid ${tokens.colors.border}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              backgroundColor: tokens.colors.accentSuccessLight,
              border: `1px solid ${tokens.colors.accentSuccess}`,
              borderRadius: tokens.radius.full,
              padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
              marginBottom: tokens.spacing.lg,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: tokens.radius.full,
                backgroundColor: tokens.colors.accentSuccess,
              }}
            />
            <span
              style={{
                fontSize: tokens.font.sm,
                color: tokens.colors.accentSuccess,
                fontWeight: 600,
              }}
            >
              Real-time cost visibility
            </span>
          </div>

          <h1
            style={{
              fontSize: tokens.font.xxl,
              fontWeight: 800,
              color: tokens.colors.textPrimary,
              marginBottom: tokens.spacing.md,
              lineHeight: 1.2,
            }}
          >
            Know exactly where your
            <br />
            <span style={{ color: tokens.colors.accentSuccess }}>
              Kubernetes spend
            </span>{" "}
            goes
          </h1>

          <p
            style={{
              fontSize: tokens.font.lg,
              color: tokens.colors.textSecondary,
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Drill from cluster to namespace to pod. Spot waste instantly.
            Optimize with confidence.
          </p>
        </motion.div>
      </div>

      {/* Cost Explorer Section — scroll triggered */}
      <section
        ref={sectionRef}
        className="section-padding"
        aria-labelledby="explorer-heading"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Section heading */}
          <h2
            id="explorer-heading"
            style={{
              fontSize: tokens.font.xl,
              fontWeight: 700,
              color: tokens.colors.textPrimary,
              marginBottom: tokens.spacing.xs,
            }}
          >
            Cost Explorer
          </h2>
          <p
            style={{
              fontSize: tokens.font.md,
              color: tokens.colors.textMuted,
              marginBottom: tokens.spacing.xl,
            }}
          >
            Click any cluster to drill into namespaces, then into pods.
          </p>

          {/* Card wrapping the explorer */}
          <motion.div
            className="card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            style={{ padding: tokens.spacing.xl }}
          >
            <CostExplorer />
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: tokens.spacing.xl,
          borderTop: `1px solid ${tokens.colors.border}`,
          color: tokens.colors.textMuted,
          fontSize: tokens.font.sm,
        }}
      >
        Built for Atomity Frontend Challenge — KubeScope
      </footer>
    </main>
  );
}