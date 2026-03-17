import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
                {/* Hero Section */}
                <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center">
                    <div className="container text-center py-20">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in"> KomekArch </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90"> Изучайте компьютерную архитектуру с помощью интеллектуального ассистента </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button onClick={() => router.push('/courses')} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"> Начать учиться </button>
                            <button onClick={() => router.push('/about')} className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"> Узнать больше </button>
                        </div>
                    </div>
                </section>
                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container">
                        <h2 className="text-4xl font-bold text-center mb-16">Почему KomekArch?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="text-4xl mb-4">🤖</div>
                                <h3 className="text-2xl font-bold mb-4">ИИ Ассистент</h3>
                                <p className="text-gray-700"> Получайте персонализированные ответы на свои вопросы от интеллектуального помощника </p>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                <div className="text-4xl mb-4">📚</div>
                                <h3 className="text-2xl font-bold mb-4">Структурированный курс</h3>
                                <p className="text-gray-700"> От основ до продвинутых тем - все в одном месте </p>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                                <div className="text-4xl mb-4">💻</div>
                                <h3 className="text-2xl font-bold mb-4">Практика</h3>
                                <p className="text-gray-700"> Интерактивные примеры и задачи для закрепления знаний </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Courses Preview Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container">
                        <h2 className="text-4xl font-bold text-center mb-16">Наши курсы</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {coursesProgram.modules.slice(0, 4).map((m, idx) => {
                                const border = ['border-blue-500', 'border-purple-500', 'border-cyan-500', 'border-green-500'][idx] ?? 'border-blue-500';
                                const accent = ['text-blue-600', 'text-purple-600', 'text-cyan-600', 'text-green-600'][idx] ?? 'text-blue-600';

                                return (
                                    <Link key={m.id} href={`/courses/${m.id}`}>
                                        <div className={`p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-l-4 ${border}`}>
                                            <h3 className="text-2xl font-bold mb-4">{m.title}</h3>
                                            <p className="text-gray-700 mb-4">{m.description}</p>
                                            <div className={`${accent} font-bold`}>Начать →</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="container text-center">
                        <h2 className="text-4xl font-bold mb-6">Готовы начать?</h2>
                        <p className="text-xl mb-8">Присоединяйтесь к нашему сообществу студентов</p>
                        <button onClick={() => router.push('/courses')} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"> Начать сейчас </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
