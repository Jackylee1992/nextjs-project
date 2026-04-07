import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "本地 HTML 项目",
  description: "这是一个本地 HTML 项目",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  openGraph: {
    title: "本地 HTML 项目",
    description: "这是一个本地 HTML 项目",
    url: "/",
    siteName: "本地 HTML 项目",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/api/og?width=1200&height=630",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "本地 HTML 项目",
    description: "这是一个本地 HTML 项目",
    images: ["/api/og?width=1200&height=675"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
