import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import AiAssistant from '../components/AiAssistant';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={(pageProps as any).session}>
            <Component {...pageProps} />
            <AiAssistant />
        </SessionProvider>
    );
}
