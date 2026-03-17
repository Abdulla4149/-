import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { coursesById } from '../../constants/coursesData';

type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
};

type CourseLesson = {
  id: string;
  title: string;
  description: string;
  fullText: string;
  quiz: QuizQuestion[];
  homework: string;
};

type AnswerState = {
  selectedIndex: number | null;
  feedback: 'correct' | 'wrong' | null;
};

function splitByCodeFence(markdown: string) {
  const parts: Array<
    | { kind: 'text'; value: string }
    | { kind: 'code'; lang: string | null; value: string }
  > = [];

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';
    const fence = line.match(/^```(\w+)?\s*$/);

    if (!fence) {
      const start = i;
      while (i < lines.length && !/^```(\w+)?\s*$/.test(lines[i] ?? '')) i++;
      parts.push({ kind: 'text', value: lines.slice(start, i).join('\n') });
      continue;
    }

    const lang = fence[1] ?? null;
    i++; // after opening ```
    const start = i;
    while (i < lines.length && !/^```\s*$/.test(lines[i] ?? '')) i++;
    const code = lines.slice(start, i).join('\n');
    // skip closing fence if present
    if (i < lines.length && /^```\s*$/.test(lines[i] ?? '')) i++;
    parts.push({ kind: 'code', lang, value: code });
  }

  return parts;
}

function renderInline(text: string) {
  const nodes: React.ReactNode[] = [];
  let rest = text;
  let key = 0;

  while (rest.length > 0) {
    const boldIdx = rest.indexOf('**');
    const codeIdx = rest.indexOf('`');
    const nextIdx =
      boldIdx === -1
        ? codeIdx
        : codeIdx === -1
          ? boldIdx
          : Math.min(boldIdx, codeIdx);

    if (nextIdx === -1) {
      nodes.push(<Fragment key={key++}>{rest}</Fragment>);
      break;
    }

    if (nextIdx > 0) {
      nodes.push(<Fragment key={key++}>{rest.slice(0, nextIdx)}</Fragment>);
      rest = rest.slice(nextIdx);
      continue;
    }

    if (rest.startsWith('**')) {
      const end = rest.indexOf('**', 2);
      if (end === -1) {
        nodes.push(<Fragment key={key++}>{rest}</Fragment>);
        break;
      }
      const content = rest.slice(2, end);
      nodes.push(
        <strong key={key++} className="font-semibold">
          {content}
        </strong>,
      );
      rest = rest.slice(end + 2);
      continue;
    }

    if (rest.startsWith('`')) {
      const end = rest.indexOf('`', 1);
      if (end === -1) {
        nodes.push(<Fragment key={key++}>{rest}</Fragment>);
        break;
      }
      const content = rest.slice(1, end);
      nodes.push(
        <code
          key={key++}
          className="rounded bg-slate-100 px-1 py-0.5 text-[0.95em] text-slate-900"
        >
          {content}
        </code>,
      );
      rest = rest.slice(end + 1);
    }
  }

  return nodes;
}

function MarkdownContent({ value }: { value: string }) {
  const parts = splitByCodeFence(value);

  return (
    <div className="space-y-4">
      {parts.map((p, idx) => {
        if (p.kind === 'code') {
          return (
            <pre
              key={`code-${idx}`}
              className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-slate-100 text-sm leading-relaxed"
            >
              <code>{p.value}</code>
            </pre>
          );
        }

        const lines = p.value.split('\n');
        const blocks: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
          const line = lines[i] ?? '';

          if (/^\s*---\s*$/.test(line)) {
            blocks.push(<hr key={`hr-${idx}-${i}`} className="border-gray-200" />);
            i++;
            continue;
          }

          const h2 = line.match(/^##\s+(.*)$/);
          if (h2) {
            blocks.push(
              <h2 key={`h2-${idx}-${i}`} className="text-xl md:text-2xl font-bold">
                {renderInline(h2[1] ?? '')}
              </h2>,
            );
            i++;
            continue;
          }

          const h3 = line.match(/^###\s+(.*)$/);
          if (h3) {
            blocks.push(
              <h3 key={`h3-${idx}-${i}`} className="text-lg md:text-xl font-bold">
                {renderInline(h3[1] ?? '')}
              </h3>,
            );
            i++;
            continue;
          }

          if (/^\s*-\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\s*-\s+/.test(lines[i] ?? '')) {
              items.push((lines[i] ?? '').replace(/^\s*-\s+/, ''));
              i++;
            }
            blocks.push(
              <ul key={`ul-${idx}-${i}`} className="list-disc pl-6 space-y-1 text-gray-700">
                {items.map((it, j) => (
                  <li key={`li-${idx}-${i}-${j}`}>{renderInline(it)}</li>
                ))}
              </ul>,
            );
            continue;
          }

          if (line.trim() === '') {
            i++;
            continue;
          }

          blocks.push(
            <p key={`p-${idx}-${i}`} className="text-gray-700 leading-relaxed">
              {renderInline(line)}
            </p>,
          );
          i++;
        }

        return (
          <div key={`text-${idx}`} className="space-y-3">
            {blocks}
          </div>
        );
      })}
    </div>
  );
}

export default function CourseLessonPage() {
  const router = useRouter();
  const rawId = router.query.id;
  const id = typeof rawId === 'string' ? rawId : null;

  useEffect(() => {
    if (!id) return;
    void router.replace(
      { pathname: '/course/architecture', query: { step: id } },
      undefined,
      { shallow: true },
    );
  }, [id, router]);

  const course = useMemo<CourseLesson | undefined>(
    () => (id ? coursesById[id] : undefined),
    [id],
  );
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  useEffect(() => {
    setAnswers({});
  }, [id]);

  function onPick(questionIndex: number, optionIndex: number) {
    if (!course) return;
    const isCorrect = course.quiz[questionIndex]?.correctAnswer === optionIndex;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        selectedIndex: optionIndex,
        feedback: isCorrect ? 'correct' : 'wrong',
      },
    }));
  }

  return (
    <>
      <Head>
        <title>
          {course ? `${course.title} — KomekArch` : 'Курс — KomekArch'}
        </title>
        <meta
          name="description"
          content={
            course
              ? course.description
              : 'Учебная страница курса по компьютерной архитектуре.'
          }
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        <section
          className="py-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <div className="container">
            <div className="flex flex-col gap-4">
              <div className="text-sm text-white/80">
                <Link href="/" className="hover:underline">
                  Главная
                </Link>
                <span className="mx-2">/</span>
                <Link href="/courses" className="hover:underline">
                  Курсы
                </Link>
                {course && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-white/95">{course.title}</span>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold">
                {course ? course.title : 'Курс не найден'}
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-3xl">
                {course
                  ? course.description
                  : 'Проверьте ссылку или выберите курс из списка.'}
              </p>

              {!course && (
                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-slate-900 font-semibold hover:bg-gray-100 transition"
                  >
                    Вернуться на главную
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {course && (
          <section className="py-10">
            <div className="container grid gap-8 lg:grid-cols-[1fr,380px]">
              <article className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">Теория</h2>
                <MarkdownContent value={course.fullText} />
              </article>

              <aside className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 h-fit">
                <h2 className="text-2xl font-bold mb-2">Мини‑тест</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Выберите ответ. После выбора покажем результат и объяснение.
                </p>

                <div className="space-y-6">
                  {course.quiz.map((q, qi) => {
                    const state = answers[qi] ?? { selectedIndex: null, feedback: null };
                    return (
                      <fieldset key={q.question} className="space-y-3">
                        <legend className="font-semibold text-gray-800">
                          {qi + 1}. {q.question}
                        </legend>
                        <div className="grid gap-2">
                          {q.options.map((opt, oi) => {
                            const checked = state.selectedIndex === oi;
                            const showResult = state.feedback !== null;
                            const isCorrect = oi === q.correctAnswer;
                            const isWrongSelected =
                              showResult && checked && state.feedback === 'wrong';

                            return (
                              <label
                                key={opt}
                                className={`flex items-start gap-3 rounded-xl px-3 py-2 ring-1 cursor-pointer transition ${
                                  showResult && isCorrect
                                    ? 'bg-emerald-50 ring-emerald-200'
                                    : isWrongSelected
                                      ? 'bg-rose-50 ring-rose-200'
                                      : checked
                                        ? 'bg-blue-50 ring-blue-200'
                                        : 'bg-white ring-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${qi}`}
                                  checked={checked}
                                  onChange={() => onPick(qi, oi)}
                                  className="mt-1"
                                />
                                <span className="text-sm text-gray-700">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                        {state.feedback === 'correct' && (
                          <div className="text-sm font-semibold text-emerald-700">
                            Верно!
                          </div>
                        )}
                        {state.feedback === 'wrong' && (
                          <div className="text-sm font-semibold text-rose-700">Неверно.</div>
                        )}
                        {state.feedback !== null && (
                          <div className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-semibold">Пояснение:</span>{' '}
                            {q.explanation}
                          </div>
                        )}
                      </fieldset>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  <h3 className="text-lg font-bold mb-2">Домашнее задание</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{course.homework}</p>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  <Link
                    href="/courses"
                    className="inline-flex justify-center w-full items-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
                  >
                    К списку модулей
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}


