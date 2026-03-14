"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import CostExplorer from "@/components/CostExplorer/CostExplorer";

const STATS = [
  { value: "70%", label: "Avg. cost reduction" },
  { value: "5min", label: "Setup time" },
  { value: "100%", label: "Your infrastructure" },
];

const WORDS = ["Clusters", "Namespaces", "Pods", "Waste"];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLElement>(null);
  const isExplorerInView = useInView(explorerRef, {
    once: true,
    margin: "-80px",
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -80]);
  const explorerScale = useTransform(scrollYProgress, [0.1, 0.28], [0.88, 1]);
  const explorerRotateX = useTransform(scrollYProgress, [0.1, 0.28], [12, 0]);
  const explorerOpacity = useTransform(scrollYProgress, [0.1, 0.28], [0, 1]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Fixed background effects */}
      <div className="grid-bg" />
      <div className="radial-glow" />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${tokens.spacing.md} clamp(1.25rem, 5vw, 4rem)`,
          borderBottom: `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.bgGlass,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: tokens.radius.md,
              background: `linear-gradient(135deg, ${tokens.colors.accentSuccess}, color-mix(in srgb, ${tokens.colors.accentSuccess} 60%, ${tokens.colors.accentPrimary}))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${tokens.colors.accentGlow}`,
            }}
          >
            <span style={{ color: "#080B14", fontWeight: 900, fontSize: "15px", fontFamily: tokens.font.mono }}>K</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: tokens.font.lg, color: tokens.colors.textPrimary, letterSpacing: "-0.02em" }}>
            KubeScope
          </span>
        </motion.div>

        {/* Theme toggle */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{
            background: tokens.colors.bgCard,
            border: `1px solid ${tokens.colors.borderStrong}`,
            borderRadius: tokens.radius.full,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            cursor: "pointer",
            fontSize: tokens.font.sm,
            color: tokens.colors.textSecondary,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.xs,
          }}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </motion.button>
      </nav>

      {/* ── HERO SECTION ── */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="section-padding"
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            paddingTop: "80px",
          }}
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              border: `1px solid ${tokens.colors.borderGlow}`,
              borderRadius: tokens.radius.full,
              padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
              marginBottom: tokens.spacing.xl,
              backgroundColor: tokens.colors.accentSuccessLight,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: tokens.radius.full,
                backgroundColor: tokens.colors.accentSuccess,
              }}
            />
            <span style={{
              fontSize: tokens.font.sm,
              color: tokens.colors.accentSuccess,
              fontWeight: 600,
              fontFamily: tokens.font.mono,
            }}>
              LIVE COST MONITORING
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            style={{
              fontSize: tokens.font.xxxl,
              fontWeight: 900,
              color: tokens.colors.textPrimary,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: tokens.spacing.md,
              maxWidth: "800px",
            }}
          >
            See every dollar
            <br />
            across your{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    color: tokens.colors.accentSuccess,
                    display: "inline-block",
                    textShadow: `0 0 40px ${tokens.colors.accentGlow}`,
                  }}
                >
                  {WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontSize: tokens.font.lg,
              color: tokens.colors.textSecondary,
              maxWidth: "480px",
              lineHeight: 1.7,
              marginBottom: tokens.spacing.xxl,
            }}
          >
            Drill from cluster to pod in seconds.
            Detect waste before it hits your invoice.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              display: "flex",
              gap: tokens.spacing.xxl,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: tokens.spacing.xxl,
            }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                style={{ textAlign: "center" }}
              >
                <div style={{
                  fontSize: tokens.font.xxl,
                  fontWeight: 900,
                  color: tokens.colors.accentSuccess,
                  fontFamily: tokens.font.mono,
                  textShadow: `0 0 30px ${tokens.colors.accentGlow}`,
                  letterSpacing: "-0.02em",
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: tokens.font.sm,
                  color: tokens.colors.textMuted,
                  marginTop: tokens.spacing.xs,
                  fontFamily: tokens.font.mono,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: tokens.spacing.sm,
              color: tokens.colors.textMuted,
              fontSize: tokens.font.sm,
              fontFamily: tokens.font.mono,
            }}
          >
            <span>scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "24px",
                height: "40px",
                border: `1px solid ${tokens.colors.borderStrong}`,
                borderRadius: tokens.radius.full,
                display: "flex",
                justifyContent: "center",
                paddingTop: "6px",
              }}
            >
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "4px",
                  height: "8px",
                  borderRadius: tokens.radius.full,
                  backgroundColor: tokens.colors.accentSuccess,
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── EXPLORER SECTION — 3D scroll reveal ── */}
      <section
        ref={explorerRef}
        aria-labelledby="explorer-heading"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)`,
          perspective: "1200px",
        }}
      >
        <motion.div
          style={{
            scale: explorerScale,
            rotateX: explorerRotateX,
            opacity: explorerOpacity,
            transformOrigin: "top center",
            width: "100%",
            maxWidth: "1100px",
          }}
        >
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isExplorerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.md,
              marginBottom: tokens.spacing.xl,
            }}
          >
            <div style={{
              height: "1px",
              width: "40px",
              backgroundColor: tokens.colors.accentSuccess,
              boxShadow: `0 0 8px ${tokens.colors.accentSuccess}`,
            }} />
            <span style={{
              fontSize: tokens.font.sm,
              color: tokens.colors.accentSuccess,
              fontFamily: tokens.font.mono,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}>
              Cost Explorer
            </span>
            <div style={{
              height: "1px",
              flex: 1,
              backgroundColor: tokens.colors.border,
            }} />
          </motion.div>

          <motion.h2
            id="explorer-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isExplorerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: tokens.font.xxl,
              fontWeight: 900,
              color: tokens.colors.textPrimary,
              marginBottom: tokens.spacing.sm,
              letterSpacing: "-0.03em",
            }}
          >
            Your entire infrastructure.
            <span style={{ color: tokens.colors.accentSuccess }}> One view.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isExplorerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: tokens.font.md,
              color: tokens.colors.textMuted,
              marginBottom: tokens.spacing.xxl,
              fontFamily: tokens.font.mono,
            }}
          >
            Click any bar to drill down → cluster → namespace → pod
          </motion.p>

          {/* The glass card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isExplorerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="glass-card"
            style={{ padding: `clamp(1.5rem, 4vw, 2.5rem)` }}
          >
            {/* Glow border top */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${tokens.colors.accentSuccess}, transparent)`,
              boxShadow: `0 0 20px ${tokens.colors.accentSuccess}`,
            }} />

            <CostExplorer />
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: tokens.spacing.xl,
          borderTop: `1px solid ${tokens.colors.border}`,
          color: tokens.colors.textMuted,
          fontSize: tokens.font.sm,
          fontFamily: tokens.font.mono,
        }}
      >
        KubeScope — Built for Atomity Frontend Engineering 
      </footer>
    </div>
  );
}