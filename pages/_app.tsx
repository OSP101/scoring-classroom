import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react"
import { NextUIProvider } from "@nextui-org/system";
import NavbarComponent from "@/Components/Navbar/Nav";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider >
        <NavWrapper>
          <Component {...pageProps} />
        </NavWrapper>
      </NextUIProvider>
    </SessionProvider>
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