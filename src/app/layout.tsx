import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import getCurrentUser from "./actions/getCurrentUser";
import NavBar from "@/components/navigation/NavBar";
import Script from "next/script";
import ToastProvider from "@/components/providers/ToastProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";

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
  title: "Super",
  description: "Super 홈페이지",
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
        <meta
          httpEquiv="Permissions-Policy"
          content="interest-cohort=(), browsing-topics=(), join-ad-interest-group=(), run-ad-auction=()"
        />
        <meta name="back-forward-cache" content="enabled" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>
          <QueryProvider>
            <NavBar currentUser={currentUser} />
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
