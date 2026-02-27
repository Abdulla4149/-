import React from 'react';
import Head from 'next/head';
import Header from '../components/Header'; // Добавь эту строку
import Footer from '../components/Footer';

type CourseModule = {
  id: string;
  title: string;
  level: 'Базовый' | 'Средний' | 'Продвинутый';
  duration: string;
  focus: string;
  topics: string[];
};

const courseModules: CourseModule[] = [
  {
    id: 'cpu-arch',
    title: 'Архитектура процессора',
    level: 'Базовый',
    duration: '6–8 часов',
    focus: 'От логических вентилей до простого процессорного ядра.',
    topics: [
      'Модель фон Неймана и регистровая архитектура',
      'Набор команд (ISA) и форматы инструкций',
      'ALU, регистровый файл, счетчик команд',
      'Цикл выполнения инструкции: выборка, декодирование, исполнение',
    ],
  },
  {
    id: 'memory',
    title: 'Подсистема памяти',
    level: 'Средний',
    duration: '8–10 часов',
    focus: 'Как процессор работает с памятью и что влияет на скорость.',
    topics: [
      'Типы памяти: регистры, SRAM, DRAM, постоянная память',
      'Адресное пространство и выравнивание данных',
      'Виртуальная память и страничная организация',
      'Задержки доступа и пропускная способность',
    ],
  },
  {
    id: 'cache',
    title: 'Кэш‑память',
    level: 'Средний',
    duration: '6–8 часов',
    focus: 'Почему кэш так важен и как он устроен.',
    topics: [
      'Принцип локальности: временная и пространственная',
      'Уровни кэша (L1, L2, L3)',
      'Политики отображения: прямое, ассоциативное, set‑associative',
      'Политики замещения и записи (write‑through, write‑back)',
    ],
  },
  {
    id: 'pipelining',
    title: 'Конвейеризация',
    level: 'Продвинутый',
    duration: '8–12 часов',
    focus: 'Как ускорить процессор за счёт параллелизма внутри ядра.',
    topics: [
      'Идея конвейера и его стадии',
      'Структурные, управляющие и дата‑hazards',
      'Методы разрешения конфликтов (stall, forwarding, predication)',
      'Предсказание переходов и суперскалярные архитектуры',
    ],
  },
];

const levelColors: Record<CourseModule['level'], string> = {
  'Базовый': 'bg-green-100 text-green-800',
  'Средний': 'bg-blue-100 text-blue-800',
  'Продвинутый': 'bg-purple-100 text-purple-800',
};

const CoursesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>KomekArch — Курсы по компьютерной архитектуре</title>
        <meta
          name="description"
          content="Структурированные модули по архитектуре процессора, подсистеме памяти, кэш‑памяти и конвейеризации."
        />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Курсы по компьютерной архитектуре
            </h1>
            <p className="text-lg md:text-xl max-w-3xl">
              Эти модули проведут вас от базового понимания архитектуры процессора
              до продвинутых тем, таких как кэш‑иерархия и конвейеризация.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {courseModules.map((module) => (
                <article
                  key={module.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col"
                >
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4 gap-3">
                      <h2 className="text-2xl font-bold">{module.title}</h2>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${levelColors[module.level]}`}
                      >
                        {module.level}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{module.focus}</p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="font-medium">Длительность:</span>
                      <span className="ml-2">{module.duration}</span>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Что вы разберёте в этом модуле:
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {module.topics.map((topic) => (
                          <li key={topic} className="flex items-start gap-2">
                            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-4">
                      <button className="w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition">
                        Открыть модуль (скоро)
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CoursesPage;
