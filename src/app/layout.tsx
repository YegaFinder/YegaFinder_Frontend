import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/shared/toast-provider";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
