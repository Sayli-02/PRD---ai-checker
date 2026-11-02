import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { brand } from "@/config/brand";
import { UtmCapture } from "@/components/utm-capture";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name}: get found on Google and named by AI`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_IN",
    title: `${brand.name}: get found on Google and named by AI`,
    description: brand.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: brand.colors.dark,
};

// brand.colors -> :root custom variables (--dark, --cream, --accent, ...)
const colorVars = `:root{${Object.entries(brand.colors)
  .map(([key, value]) => `--${key}:${value}`)
  .join(";")}}`;

const gaId = process.env.NEXT_PUBLIC_GA4_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${brand.fonts.display.variable} ${brand.fonts.body.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <UtmCapture />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {pixelId && (
          <Script id="meta-pixel" strategy="lazyOnload">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
          </Script>
        )}
        {clarityId && (
          <Script id="clarity" strategy="lazyOnload">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
