import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayaRTI | Right to Information Application & Appeal Drafter",
  description: "Draft legally compliant Right to Information (RTI) applications, Section 19(1) First Appeals, and Section 2(j) inspection notices under the RTI Act, 2005.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased flex flex-col selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
