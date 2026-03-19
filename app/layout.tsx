import "../styles/globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";

export const metadata: Metadata = {
  title: "KomekArch",
  description: "Интерактивная платформа для изучения компьютерной архитектуры",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body>
        {children}
        <AiAssistant />
        <Footer />
      </body>
    </html>
  );
}

