import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { MotionConfig } from "framer-motion";
import { CustomCursorProvider } from "@/components/custom-cursor";
import { LenisProvider } from "@/components/lenis-provider";
import { GrainOverlay } from "@/components/grain-overlay";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Luxury Mobile Massage | Zen Modern Wellness",
  description: "Luxury wellness, delivered to your door. Bespoke in-home massage experiences with a Zen Modern aesthetic."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-sansClean bg-pearl text-stone`}>
        <LenisProvider>
          <MotionConfig
            transition={{
              duration: 0.6,
              ease: [0.22, 0.61, 0.36, 1]
            }}
          >
            <CustomCursorProvider>
              <GrainOverlay />
              {children}
              <Analytics />
              <SpeedInsights />
            </CustomCursorProvider>
          </MotionConfig>
        </LenisProvider>
      </body>
    </html>
  );
}

