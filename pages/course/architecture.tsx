import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { coursesProgram } from '../../constants/coursesData';

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

          const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
          if (image) {
            const alt = image[1] ?? 'image';
            const src = image[2] ?? '';
            blocks.push(
              <div key={`img-${idx}-${i}`} className="my-8 flex justify-center">
                <img
                  src={src}
                  alt={alt}
                  className="rounded-xl shadow-md max-w-full h-auto"
                  loading="lazy"
                />
              </div>,
            );
            i++;
            continue;
          }

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

          if (/^\s*\d+\.\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? '')) {
              items.push((lines[i] ?? '').replace(/^\s*\d+\.\s+/, ''));
              i++;
            }
            blocks.push(
              <ol key={`ol-${idx}-${i}`} className="list-decimal pl-6 space-y-1 text-gray-700">
                {items.map((it, j) => (
                  <li key={`oli-${idx}-${i}-${j}`}>{renderInline(it)}</li>
                ))}
              </ol>,
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

export default function ArchitectureCoursePage() {
  const router = useRouter();
  const rawStep = router.query.step;
  const stepFromQuery = typeof rawStep === 'string' ? rawStep : null;

  const defaultStepId = coursesProgram.modules[0]?.id ?? 'step-1';
  const initialStepId = coursesProgram.modules.some((m) => m.id === stepFromQuery)
    ? (stepFromQuery as string)
    : defaultStepId;

  const [activeId, setActiveId] = useState<string>(initialStepId);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  useEffect(() => {
    if (!stepFromQuery) return;
    if (!coursesProgram.modules.some((m) => m.id === stepFromQuery)) return;
    setActiveId(stepFromQuery);
  }, [stepFromQuery]);

  const activeModule = useMemo(
    () => coursesProgram.modules.find((m) => m.id === activeId) ?? coursesProgram.modules[0],
    [activeId],
  );

  useEffect(() => {
    setAnswers({});
  }, [activeId]);

  function pickStep(id: string) {
    setActiveId(id);
    void router.replace(
      { pathname: '/course/architecture', query: { step: id } },
      undefined,
      { shallow: true },
    );
  }

  function onPick(questionIndex: number, optionIndex: number) {
    if (!activeModule) return;
    const isCorrect = activeModule.quiz[questionIndex]?.correctAnswer === optionIndex;
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
          {coursesProgram.programTitle}
          {activeModule ? ` — ${activeModule.title}` : ''}
        </title>
        <meta
          name="description"
          content="Единый курс по архитектуре ЭВМ с навигацией по этапам: от логических вентилей до параллельных вычислений."
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container">
            <div className="text-sm text-white/80">
              <Link href="/" className="hover:underline">
                Главная
              </Link>
              <span className="mx-2">/</span>
              <Link href="/courses" className="hover:underline">
                Курсы
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/95">Архитектура ЭВМ</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mt-3">
              Архитектура ЭВМ — единая траектория
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-3xl mt-3">
              Выбирайте этап в боковой панели — контент обновится мгновенно без перезагрузки.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container grid gap-6 lg:grid-cols-[320px,1fr]">
            <aside className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5 h-fit lg:sticky lg:top-24">
              <div className="text-sm font-semibold text-gray-700 mb-3">Этапы курса</div>
              <nav className="grid gap-2">
                {coursesProgram.modules.map((m, idx) => {
                  const active = m.id === activeId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => pickStep(m.id)}
                      className={`text-left rounded-xl px-3 py-3 ring-1 transition ${
                        active
                          ? 'bg-blue-50 ring-blue-200'
                          : 'bg-white ring-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">{m.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{m.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="grid gap-6">
              {activeModule && (
                <>
                  <article className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col gap-2 mb-4">
                      <h2 className="text-2xl md:text-3xl font-bold">{activeModule.title}</h2>
                      <p className="text-gray-600">{activeModule.description}</p>
                    </div>
                    <MarkdownContent value={activeModule.fullText} />
                  </article>

                  <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-2">Мини‑тест</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Выберите ответ. После выбора покажем результат и объяснение.
                    </p>

                    <div className="space-y-6">
                      {activeModule.quiz.map((q, qi) => {
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
                              <div className="text-sm font-semibold text-emerald-700">Верно!</div>
                            )}
                            {state.feedback === 'wrong' && (
                              <div className="text-sm font-semibold text-rose-700">Неверно.</div>
                            )}
                            {state.feedback !== null && (
                              <div className="text-sm text-gray-700 leading-relaxed">
                                <span className="font-semibold">Пояснение:</span> {q.explanation}
                              </div>
                            )}
                          </fieldset>
                        );
                      })}
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-3">Домашнее задание</h2>
                    <p className="text-gray-700 leading-relaxed">{activeModule.homework}</p>
                  </section>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

