import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react"
import { NextUIProvider } from "@nextui-org/system";
import NavbarComponent from "@/Components/Navbar/Nav";
import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <SessionProvider session={session}>
        <NextUIProvider >
          <NextThemesProvider attribute="class" defaultTheme="light" storageKey="theme">
            <meta name="google-site-verification" content="F6z6ihjP_j_3j1lcrmvdMGhCkhwdjdclCuxmQ4C9I68" />
            <NavWrapper>
              <Component {...pageProps} />
            </NavWrapper>
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
    </>
  )
}

function NavWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <>
      {session && <NavbarComponent />
      }
      {children}
    </>
  );
}