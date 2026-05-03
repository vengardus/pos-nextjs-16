import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { AppConstants } from "@/shared/constants/app.constants";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: AppConstants.APP_NAME,
    template: `%s | ${AppConstants.APP_NAME}`,
  },
  description: "Sistema POS integral para la gestión eficiente de ventas e inventarios.",
  keywords: ["POS", "Punto de Venta", "Gestión", "Inventarios", "Ventas", "POS-EF2R"],
  authors: [{ name: "vengardus" }],
  creator: "vengardus",
  openGraph: {
    title: AppConstants.APP_NAME,
    description: "Sistema POS integral para la gestión eficiente de ventas e inventarios.",
    siteName: AppConstants.APP_NAME,
    locale: "es_PE",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
