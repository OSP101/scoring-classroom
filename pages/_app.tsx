import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react"
import { HeroUIProvider } from "@heroui/system";
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // คำเตือนสีเหลืองพื้นแดง
      console.log(
        '%cคำเตือน!',
        'background: yellow; color: red; font-size: 2rem; font-weight: bold; padding: 4px 12px;'
      );
      // ข้อความเตือนหลัก
      console.log(
        '%cการใช้คอนโซลนี้อาจทำให้ผู้โจมตีสามารถแอบอ้างตัวเป็นคุณและขโมยข้อมูลของคุณได้โดยใช้การโจมตีที่เรียกว่า Self-XSS\nอย่าป้อนหรือวางโค้ดที่คุณไม่เข้าใจ',
        'font-size: 1.2rem; color: white; background: black; padding: 4px 8px;'
      );
    }
  }, []);
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
        <HeroUIProvider >
          <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={true}>
            <meta name="google-site-verification" content="F6z6ihjP_j_3j1lcrmvdMGhCkhwdjdclCuxmQ4C9I68" />
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427071385649225" crossOrigin="anonymous"></script>
            
            <NavWrapper>
              <Component {...pageProps} />
            </NavWrapper>
          </NextThemesProvider>
        </HeroUIProvider>
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