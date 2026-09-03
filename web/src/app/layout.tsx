import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "PALIER - Simulateur de politique tarifaire TGV",
  description: "Analyse pricing et optimisation de grilles sur les tarifs TGV INOUI/OUIGO (SNCF Open Data).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={kanit.className}>{children}</body>
    </html>
  );
}
