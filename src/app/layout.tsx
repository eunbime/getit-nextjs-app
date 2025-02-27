import "./globals.css";
import { Metadata } from "next/types";
import localFont from "next/font/local";
import Script from "next/script";

import getCurrentUser from "./actions/getCurrentUser";
import ToastProvider from "@/components/providers/ToastProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import ClientUserInitializer from "@/components/providers/ClientUserInitializer";
import Header from "@/components/common/Header";

export const dynamic = "force-dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "GETIT | %s",
    default: "GETIT",
  },
  description: "GETIT 홈페이지입니다.",
  other: {
    "Cache-Control": "public, max-age=3600, must-revalidate",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta
          httpEquiv="Permissions-Policy"
          content="interest-cohort=(), browsing-topics=(), join-ad-interest-group=(), run-ad-auction=()"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="back-forward-cache" content="enabled" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>
          <QueryProvider>
            <Header currentUser={currentUser} />
            <ClientUserInitializer currentUser={currentUser} />
            <ToastProvider />
            {children}
            <Script
              type="text/javascript"
              src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`}
            />
          </QueryProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
