import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AiAssistant from '../components/AiAssistant';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <AiAssistant />
        </>
    );
}
