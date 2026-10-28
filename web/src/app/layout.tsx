import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPortfolio } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import "./globals.css";

/** Sets the theme class before first paint so there is no light/dark flash. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const title = `${profile.name} · ${profile.headline}`;
  const description = `${profile.headline}. Java, Go and TypeScript microservices, Kafka, Kubernetes and Terraform. Based in ${profile.location}.`;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${profile.name}` },
    description,
    authors: [{ name: profile.name }],
    creator: profile.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: profile.name,
      title,
      description,
      url: "/",
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e12" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
