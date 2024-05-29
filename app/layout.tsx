import type { Metadata, Viewport } from "next";
import { Lexend_Deca, Lemon } from "next/font/google";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: 'Emi',
    template: '%s | Emi',
  },
  description: "Your Study Buddy",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  minimumScale: 1,
  maximumScale: 1,
};

const lexend_deca = Lexend_Deca({
  subsets: ["latin"],
  variable: '--font-lexend_deca',
});

const lemon = Lemon({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-lemon',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: "#FFD28E",
      }
    }}>
      <html lang="en" className={`${lexend_deca.variable} ${lemon.variable}`} suppressHydrationWarning>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
