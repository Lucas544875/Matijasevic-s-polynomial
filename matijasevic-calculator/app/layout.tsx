import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Matijasevič Polynomial Calculator",
  description:
    "26変数のMatijasevič多項式を計算できるインタラクティブアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-google-analytics-opt-out="">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
