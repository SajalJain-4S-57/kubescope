import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "KubeScope — Kubernetes Cost Explorer",
  description:
    "Real-time Kubernetes cost visibility and optimization insights. Drill down from cluster to namespace to pod.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}