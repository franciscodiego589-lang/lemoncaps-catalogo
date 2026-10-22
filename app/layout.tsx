import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Lemon Caps",
  description: "Catálogo de fórmulas Lemon Caps para pedido por atacado.",
};

// Cor da barra do navegador no mobile — casa com --lime (marca) no claro e
// com --paper (fundo escuro) no escuro, mesmo par de tokens de app/globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a6e100" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="lc-skip-link">
          Pular para o conteúdo
        </a>
        {children}
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
