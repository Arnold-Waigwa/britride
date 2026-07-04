import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Container } from "@radix-ui/themes";
import Navbar from "./Navbar";
import ClientSessionProvider from "./ClientSessionProvider";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "./ReactQueryProvider";
import ThemeProvider from "./ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Britride",
  description: "Find and share rides at Albion College",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <ClientSessionProvider>
            <ThemeProvider>
              <Toaster position="top-center" />
              <Navbar />
              <main>
                <Container size="2" px={{ initial: "4", sm: "6" }}>
                  {children}
                </Container>
              </main>
            </ThemeProvider>
          </ClientSessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
