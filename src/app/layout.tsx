import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PWARegistration } from "@/components/PWARegistration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TabbyFund — Community-Powered Cat Rescue",
  description:
    "A transparent, community-driven platform that helps rescue injured stray cats by connecting community members, verified veterinarians, and administrators through one complete rescue lifecycle.",
  keywords: ["cat rescue", "stray cats", "Thailand", "crowdfunding", "animal welfare"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TabbyFund",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6C5CE7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)}>
      <body className="min-h-dvh flex flex-col antialiased font-sans">
        {children}
        <PWARegistration />
      </body>
    </html>
  );
}

