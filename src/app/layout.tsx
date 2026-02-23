import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { ThemeSync } from "@/components/theme-sync";
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
  title: "WeekBoard — Tarefas Semanais",
  description:
    "Organize sua semana com um kanban visual por dia. Trabalho, casa e vida pessoal em um só lugar.",
};

// Inline script to prevent theme flash on load
const themeScript = `
try {
  var s = JSON.parse(localStorage.getItem('weekboard-settings') || '{}');
  var t = s.state && s.state.theme ? s.state.theme : 'dark';
  document.documentElement.setAttribute('data-theme', t);
} catch(e) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
