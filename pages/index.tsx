import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AiAssistant from '../components/AiAssistant';
import { coursesProgram } from '../constants/coursesData';

export default function Home() {
    const router = useRouter();
    return (
        <>  
            <Head>
                <title>KomekArch - Изучение компьютерной архитектуры с ИИ</title>
                <meta name="description" content="Интерактивный сайт для изучения компьютерной архитектуры с помощью ИИ-ассистента" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <main>
                <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center">
                    <div className="container text-center py-20">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6"> KomekArch </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90"> Изучайте компьютерную архитектуру с помощью ИИ </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button onClick={() => router.push('/courses')} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"> Начать учиться </button>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-16">Почему KomekArch?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="text-2xl font-bold mb-4">🤖 ИИ Ассистент</h3>
                                <p className="text-gray-700">Мгновенные ответы на вопросы.</p>
                            </div>
                            <div className="p-8 bg-purple-50 rounded-xl border border-purple-100">
                                <h3 className="text-2xl font-bold mb-4">📚 Курс</h3>
                                <p className="text-gray-700">Структурированные знания.</p>
                            </div>
                            <div className="p-8 bg-cyan-50 rounded-xl border border-cyan-100">
                                <h3 className="text-2xl font-bold mb-4">💻 Практика</h3>
                                <p className="text-gray-700">Задачи и тесты.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <AiAssistant /> 
            </main>
            <Footer />
        </>
    );
}