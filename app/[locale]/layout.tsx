import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const descriptions: Record<string, string> = {
  en: "Vibe Builder. Build the Whole Damn Thing — from idea to deployment.",
  es: "Vibe Builder. Construye todo — de la idea al despliegue.",
  "pt-BR": "Vibe Builder. Construa tudo — da ideia ao deploy.",
  id: "Vibe Builder. Bangun semuanya — dari ide sampai deployment.",
  ja: "Vibe Builder. アイデアからデプロイまで、全部つくる。",
  ko: "Vibe Builder. 아이디어부터 배포까지 빠르게.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: "zzoo.dev — Vibe Builder",
      template: "%s | zzoo.dev",
    },
    description: descriptions[locale] ?? descriptions.en,
    alternates: buildAlternates("/"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <SkipLink />
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
