import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { coursesProgram } from '../constants/coursesData';

const stepBadge = (index: number) => {
  const styles = [
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
  ];
  return styles[index] ?? 'bg-slate-100 text-slate-800';
};

export default function CoursesPage() {
  return (
    <>
      <Head>
        <title>{coursesProgram.programTitle} — Курсы</title>
        <meta
          name="description"
          content="Пошаговая образовательная траектория: от основ веба до уровня уверенного Frontend специалиста."
        />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {coursesProgram.programTitle}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl">
              Пять этапов, которые проведут вас от полного нуля до уверенного
              уровня: теория, мини‑тесты и практика.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {coursesProgram.modules.map((module, index) => (
                <article
                  key={module.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col"
                >
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4 gap-3">
                      <h2 className="text-2xl font-bold">{module.title}</h2>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${stepBadge(
                          index,
                        )}`}
                      >
                        Этап {index + 1}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{module.description}</p>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Внутри этапа:
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>Теория в формате Markdown</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>Мини‑тест (5 вопросов с объяснениями)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>Домашнее задание (проект/упражнение)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-auto pt-4">
                      <Link
                        href={`/courses/${module.id}`}
                        className="w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
                      >
                        Открыть этап
                      </Link>
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
}
