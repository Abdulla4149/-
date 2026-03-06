import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

type QuizQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

type CourseLesson = {
  id: string;
  title: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  reading: string[];
  quiz: QuizQuestion[];
};

const courseLessons: Record<string, CourseLesson> = {
  architecture: {
    id: 'architecture',
    title: 'Основы архитектуры',
    description: 'Изучите фундаментальные концепции компьютерной архитектуры.',
    accentFrom: 'from-blue-600',
    accentTo: 'to-indigo-700',
    reading: [
      'Компьютерная архитектура отвечает на вопрос: «как устроен компьютер внутри и как программа превращается в действия железа». Удобно мыслить через модель фон Неймана: есть процессор, память, устройства ввода‑вывода и шины, по которым они обмениваются данными.',
      'Процессор выполняет программу как последовательность инструкций. На самом базовом уровне ядро содержит счётчик команд (PC), блок управления, регистры и арифметико‑логическое устройство (ALU). Типичный цикл выглядит так: выбрать инструкцию из памяти, декодировать её, выполнить операцию и записать результат.',
      'Важно различать ISA и микроархитектуру. ISA — это «договор» (набор инструкций, регистры, режимы адресации). Микроархитектура — конкретная реализация этого договора: сколько стадий конвейера, какой кэш, как устроено предсказание переходов и т.д.',
    ],
    quiz: [
      {
        prompt: 'Что лучше всего описывает ISA?',
        options: [
          'Конкретную схему кэша и его размеры',
          'Набор инструкций и правила их использования',
          'Частоту процессора и техпроцесс',
        ],
        correctIndex: 1,
      },
      {
        prompt: 'Какой порядок ближе всего к «циклу инструкции»?',
        options: [
          'Декодирование → запись результата → выборка → исполнение',
          'Выборка → декодирование → исполнение → запись результата',
          'Исполнение → выборка → декодирование → запись результата',
        ],
        correctIndex: 1,
      },
      {
        prompt: 'Зачем нужны регистры в процессоре?',
        options: [
          'Чтобы хранить данные ближе и быстрее, чем в RAM',
          'Чтобы подключать периферию к USB',
          'Чтобы увеличить размер жёсткого диска',
        ],
        correctIndex: 0,
      },
    ],
  },
  processors: {
    id: 'processors',
    title: 'Процессоры и память',
    description: 'Разберитесь в том, как работают процессоры и системы памяти.',
    accentFrom: 'from-purple-600',
    accentTo: 'to-pink-600',
    reading: [
      'Производительность процессора зависит не только от частоты. Важны параллелизм, конвейер, кэш и то, насколько часто CPU «ждёт» данные из памяти. Поэтому архитектуру процессора почти всегда изучают вместе с подсистемой памяти.',
      'Оперативная память (DRAM) хранит большие объёмы данных, но доступ к ней медленнее по сравнению с регистрами и кэшами. В реальных программах именно задержки памяти часто становятся главным ограничением, особенно при работе с большими массивами и случайным доступом.',
      'Чтобы уменьшить простои, процессоры используют предвыборку, спекулятивное выполнение и кэш‑иерархию. На практике полезно научиться «читать» программу: какие данные часто используются, каков паттерн доступа (последовательный или случайный), и где возможны узкие места.',
    ],
    quiz: [
      {
        prompt: 'Почему CPU часто “упирается” в память?',
        options: [
          'Потому что DRAM обычно медленнее, чем выполнение простых инструкций',
          'Потому что компилятор всегда отключает кэш',
          'Потому что регистры хранят данные на диске',
        ],
        correctIndex: 0,
      },
      {
        prompt: 'Что находится ближе всего к ALU по скорости доступа?',
        options: ['Оперативная память (DRAM)', 'Регистры', 'SSD/диск'],
        correctIndex: 1,
      },
      {
        prompt: 'Что из этого помогает скрывать задержки памяти?',
        options: ['Кэш и предвыборка', 'Увеличение размера окна браузера', 'Удаление шрифтов'],
        correctIndex: 0,
      },
    ],
  },
  io: {
    id: 'io',
    title: 'Ввод‑вывод',
    description: 'Узнайте о системах ввода‑вывода и периферийных устройствах.',
    accentFrom: 'from-cyan-600',
    accentTo: 'to-blue-600',
    reading: [
      'Подсистема ввода‑вывода (I/O) соединяет процессор с внешним миром: дисками, сетью, клавиатурой, датчиками и т.д. Поскольку устройства работают с разной скоростью, системе нужны механизмы согласования: буферы, очереди и контроллеры.',
      'Два ключевых понятия: прерывания и DMA. Прерывание позволяет устройству “сообщить” процессору о событии, не заставляя CPU постоянно опрашивать статус. DMA (Direct Memory Access) позволяет устройству передавать данные напрямую в память, разгружая процессор от копирования.',
      'Также встречаются memory‑mapped I/O и port‑mapped I/O (в зависимости от ISA). Важно понимать, что чтение данных с диска или сети — это не просто “одна операция”: это цепочка действий устройства, контроллера, драйвера и ОС.',
    ],
    quiz: [
      {
        prompt: 'Зачем нужны прерывания?',
        options: [
          'Чтобы CPU не тратил время на постоянный опрос устройства',
          'Чтобы увеличить объём оперативной памяти',
          'Чтобы ускорить работу ALU',
        ],
        correctIndex: 0,
      },
      {
        prompt: 'Что делает DMA?',
        options: [
          'Передаёт данные напрямую между устройством и памятью',
          'Шифрует трафик в браузере',
          'Создаёт кэш L1 для процессора',
        ],
        correctIndex: 0,
      },
      {
        prompt: 'Что обычно происходит “самым медленным” в системе?',
        options: ['Доступ к регистрам', 'Умножение целых чисел', 'Операции с диском/сетью'],
        correctIndex: 2,
      },
    ],
  },
  network: {
    id: 'network',
    title: 'Сетевые архитектуры',
    description: 'Изучите принципы построения компьютерных сетей.',
    accentFrom: 'from-green-600',
    accentTo: 'to-emerald-700',
    reading: [
      'Сеть — это не только “протоколы”, но и аппаратная часть: сетевая карта (NIC), буферы, очереди, прерывания, DMA и взаимодействие с памятью. Для производительности важно, как пакеты проходят путь от провода до приложения и обратно.',
      'Полезно держать в голове уровни: физический канал, передача кадров, маршрутизация пакетов, транспорт (TCP/UDP) и прикладные протоколы. Ошибки и задержки на любом этапе влияют на итоговую скорость и стабильность соединения.',
      'На практике производительность сети часто ограничивают латентность и обработка пакетов (pps), а не “сырой” гигабит. Поэтому оптимизации включают batching, offload‑функции NIC и разумную настройку буферов.',
    ],
    quiz: [
      {
        prompt: 'Что ближе всего к реальности про NIC?',
        options: [
          'Это “просто провод”, он не влияет на CPU',
          'NIC может использовать DMA и очереди для доставки пакетов в память',
          'NIC хранит программу в виде инструкций ISA',
        ],
        correctIndex: 1,
      },
      {
        prompt: 'Что чаще всего “болит” в сетевой производительности?',
        options: ['Латентность и обработка пакетов', 'Скорость регистров', 'Количество пикселей на экране'],
        correctIndex: 0,
      },
      {
        prompt: 'Какой протокол относится к транспортному уровню?',
        options: ['TCP', 'HTML', 'PNG'],
        correctIndex: 0,
      },
    ],
  },
};

type AnswerState = {
  selectedIndex: number | null;
  feedback: 'correct' | 'wrong' | null;
};

export default function CourseLessonPage() {
  const router = useRouter();
  const rawId = router.query.id;
  const id = typeof rawId === 'string' ? rawId : null;

  const course = useMemo(() => (id ? courseLessons[id] : undefined), [id]);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  useEffect(() => {
    setAnswers({});
  }, [id]);

  function onPick(questionIndex: number, optionIndex: number) {
    if (!course) return;
    const isCorrect = course.quiz[questionIndex]?.correctIndex === optionIndex;
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
          className={`py-14 bg-gradient-to-r ${
            course ? `${course.accentFrom} ${course.accentTo}` : 'from-slate-700 to-slate-900'
          } text-white`}
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
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {course.reading.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </article>

              <aside className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 h-fit">
                <h2 className="text-2xl font-bold mb-2">Мини‑тест</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Выберите ответ. Сразу покажем результат.
                </p>

                <div className="space-y-6">
                  {course.quiz.map((q, qi) => {
                    const state = answers[qi] ?? { selectedIndex: null, feedback: null };
                    return (
                      <fieldset key={q.prompt} className="space-y-3">
                        <legend className="font-semibold text-gray-800">
                          {qi + 1}. {q.prompt}
                        </legend>
                        <div className="grid gap-2">
                          {q.options.map((opt, oi) => {
                            const checked = state.selectedIndex === oi;
                            return (
                              <label
                                key={opt}
                                className={`flex items-start gap-3 rounded-xl px-3 py-2 ring-1 cursor-pointer transition ${
                                  checked
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
                          <div className="text-sm font-semibold text-rose-700">
                            Попробуй еще раз
                          </div>
                        )}
                      </fieldset>
                    );
                  })}
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

