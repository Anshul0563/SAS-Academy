import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Gauge,
  LockKeyhole,
  Maximize2,
  RotateCcw,
  Target,
  Timer,
  XCircle,
} from "lucide-react";

import { sscStenoParagraphs } from "./sscStenoData";
import {
  buildStenoSuggestions,
  calculateStenoStats,
  formatSeconds,
} from "./sscStenoAnalytics";

function SscStenoTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shellRef = useRef(null);
  const inputRef = useRef(null);
  const paragraph =
    sscStenoParagraphs.find((item) => item.id === id) || sscStenoParagraphs[0];

  const [typedText, setTypedText] = useState("");
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(paragraph.duration);
  const [backspaceDisabled, setBackspaceDisabled] = useState(true);
  const [backspaces, setBackspaces] = useState(0);

  const elapsedSeconds = Math.max(1, paragraph.duration - timeLeft);
  const stats = useMemo(
    () =>
      calculateStenoStats({
        source: paragraph.paragraphText,
        typed: typedText,
        elapsedSeconds,
      }),
    [elapsedSeconds, paragraph.paragraphText, typedText],
  );
  const suggestions = useMemo(
    () => buildStenoSuggestions({ stats, elapsedSeconds, paragraph }),
    [elapsedSeconds, paragraph, stats],
  );

  useEffect(() => {
    setTypedText("");
    setStarted(false);
    setCompleted(false);
    setTimeLeft(paragraph.duration);
    setBackspaces(0);
  }, [paragraph]);

  useEffect(() => {
    if (!started || completed) return undefined;
    if (timeLeft <= 0 || typedText.length >= paragraph.paragraphText.length) {
      setCompleted(true);
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [
    completed,
    paragraph.paragraphText.length,
    started,
    timeLeft,
    typedText.length,
  ]);

  const handleInput = (event) => {
    if (!started) setStarted(true);
    setTypedText(
      event.target.value.slice(0, paragraph.paragraphText.length + 40),
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setBackspaces((value) => value + 1);
      if (backspaceDisabled) event.preventDefault();
    }
  };

  const resetTest = () => {
    setTypedText("");
    setStarted(false);
    setCompleted(false);
    setTimeLeft(paragraph.duration);
    setBackspaces(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const currentWordIndex = typedText.trim()
    ? typedText.trim().split(/\s+/).length - 1
    : 0;

  return (
    <div
      ref={shellRef}
      className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-3 pb-10 pt-3 text-white sm:px-5"
    >
      {" "}
      <header className="sticky top-3 z-40 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 shadow-2xl backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <button
              onClick={() => navigate("/typing-learning/ssc-steno")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Paragraph list
            </button>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300">
              SSC Steno Test Environment
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {paragraph.title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {paragraph.category} / {paragraph.practiceType} /{" "}
              {paragraph.difficulty}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[520px]">
            <HeaderStat
              label="Time"
              value={formatSeconds(timeLeft)}
              icon={Timer}
            />

            <HeaderStat
              label="Net WPM"
              value={stats.netWPM.toFixed(1)}
              icon={Gauge}
            />

            <HeaderStat
              label="Accuracy"
              value={`${stats.accuracy.toFixed(1)}%`}
              icon={Target}
            />

            <HeaderStat
              label="Mistakes"
              value={stats.mistakes}
              icon={XCircle}
            />
          </div>
        </div>
      </header>
      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* MAIN WORKSPACE */}
        <div className="min-w-0 rounded-3xl border border-white/10 bg-[#020817]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          {/* TOP BAR */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Transcription Workspace
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Current word: #{currentWordIndex + 1} / {paragraph.wordCount}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBackspaceDisabled((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  backspaceDisabled
                    ? "bg-red-500/15 text-red-100 ring-1 ring-red-500/20"
                    : "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10"
                }`}
              >
                <LockKeyhole size={16} />
                Backspace {backspaceDisabled ? "Off" : "On"}
              </button>

              <button
                onClick={() => shellRef.current?.requestFullscreen?.()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <Maximize2 size={16} />
                Fullscreen
              </button>

              <button
                onClick={resetTest}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 transition-all duration-300"
              style={{ width: `${stats.progress}%` }}
            />
          </div>

          {/* SOURCE PARAGRAPH */}
          <div className="mt-7 rounded-3xl border border-white/10 bg-[#0b1120]/80 p-6 shadow-inner">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Source Paragraph
              </h3>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                SSC Mode
              </span>
            </div>

            <StenoHighlight
              source={paragraph.paragraphText}
              typed={typedText}
              currentWordIndex={currentWordIndex}
            />
          </div>

          {/* TYPING AREA */}
          <div className="mt-7 rounded-3xl border border-white/10 bg-[#0b1120]/80 p-6 shadow-inner">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Typing Area
              </h3>

              <span className="text-xs text-slate-500">
                Long-form focused typing
              </span>
            </div>

            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              placeholder="Start SSC Steno transcription here..."
              className="h-[30vh] min-h-[220px] max-h-[320px] w-full resize-none rounded-3xl border border-white/10 bg-[#020617]/95 px-5 py-5 text-[18px] leading-[2.4rem] tracking-[0.015em] text-white shadow-inner outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-emerald-300/40 focus:bg-[#020617]"
            />
          </div>
        </div>

        {/* SIDE PANEL */}
        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <InfoPanel paragraph={paragraph} backspaces={backspaces} />
          <LiveMistakes stats={stats} />
        </aside>
      </section>
      {completed && (
        <ResultAnalytics
          stats={stats}
          suggestions={suggestions}
          paragraph={paragraph}
        />
      )}
    </div>
  );
}

function HeaderStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function StenoHighlight({ source, typed, currentWordIndex }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  const typedChars = Array.from(typed);

  let wordIndex = 0;
  let inWord = false;

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentWordIndex]);

  return (
    <div
      ref={containerRef}
      className="max-h-[320px] overflow-y-auto rounded-3xl border border-white/10 bg-[#020817]/95 p-5 shadow-inner"
    >
      <div className="mx-auto w-full max-w-full xl:max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              SSC Steno Passage
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              Read ahead and maintain rhythm
            </h3>
          </div>

          <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100">
            Word #{currentWordIndex + 1}
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl bg-[#0b1120]/80 p-4 sm:p-5">
          <p className="break-words whitespace-pre-wrap text-[16px] leading-[2.1rem] tracking-normal text-slate-300 sm:text-[18px] sm:leading-[2.5rem]">
            {Array.from(source).map((char, index) => {
              if (char !== " " && !inWord) {
                inWord = true;
              }

              const activeWord = wordIndex === currentWordIndex;

              const typedChar = typedChars[index];

              const state =
                typedChar === undefined
                  ? activeWord
                    ? "current"
                    : "pending"
                  : typedChar === char
                    ? "correct"
                    : "wrong";

              const className =
                state === "correct"
                  ? "text-emerald-200"
                  : state === "wrong"
                    ? "text-red-300"
                    : state === "current"
                      ? "bg-indigo-500/15 text-white"
                      : "text-slate-500";

              const isActive = activeWord && typedChar === undefined;

              if (char === " " && inWord) {
                wordIndex += 1;
                inWord = false;
              }

              return (
                <span
                  ref={isActive ? activeRef : null}
                  key={`${char}-${index}`}
                  className={`px-[1px] transition-colors duration-100 ${className}`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
function InfoPanel({ paragraph, backspaces }) {
  const items = [
    ["Duration", formatSeconds(paragraph.duration)],
    ["Words", paragraph.wordCount],
    ["Target WPM", paragraph.targetWPM],
    ["Accuracy Goal", `${paragraph.accuracyGoal}%`],
    ["Language", paragraph.language],
    ["Backspaces", backspaces],
  ];

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
      <h2 className="text-lg font-semibold">Exam details</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-white/10 bg-slate-950/60 p-3"
          >
            <p className="font-semibold capitalize text-white">{value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveMistakes({ stats }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
      <h2 className="text-lg font-semibold">Live error tracking</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {stats.weakKeys.length ? (
          stats.weakKeys.map((item) => (
            <span
              key={item.key}
              className="rounded-md border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-100"
            >
              {item.key} / {item.count}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">Weak keys will appear here.</p>
        )}
      </div>
    </div>
  );
}

function ResultAnalytics({ stats, suggestions, paragraph }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-emerald-300" size={20} />
          <h2 className="text-xl font-semibold">Result analytics</h2>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <ResultStat label="Gross WPM" value={stats.grossWPM.toFixed(1)} />
          <ResultStat label="Net WPM" value={stats.netWPM.toFixed(1)} />
          <ResultStat
            label="Accuracy"
            value={`${stats.accuracy.toFixed(1)}%`}
          />
          <ResultStat label="Mistakes" value={stats.mistakes} />
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-white">Typing consistency</h3>
          <div className="mt-3 flex h-28 items-end gap-2 rounded-md border border-white/10 bg-slate-950/60 p-3">
            {stats.consistency.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t bg-emerald-400/70"
                  style={{ height: `${Math.max(8, item.accuracy)}%` }}
                />
                <span className="text-[10px] text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MistakeList title="Weak words" items={stats.wrongWords} />
          <MistakeList title="Weak keys" items={stats.weakKeys} keysOnly />
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
        <div className="flex items-center gap-3">
          <Brain className="text-fuchsia-200" size={20} />
          <h2 className="text-xl font-semibold">Smart performance analysis</h2>
        </div>
        <div className="mt-4 space-y-3">
          {suggestions.map((suggestion) => (
            <p
              key={suggestion}
              className="rounded-md border border-white/10 bg-slate-950/60 p-3 text-sm leading-6 text-slate-300"
            >
              {suggestion}
            </p>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
          Recommended next level:{" "}
          <span className="font-semibold">
            {stats.netWPM >= paragraph.targetWPM &&
            stats.accuracy >= paragraph.accuracyGoal
              ? "Advanced or Expert"
              : paragraph.difficulty}
          </span>
        </div>
      </div>
    </section>
  );
}

function ResultStat({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function MistakeList({ title, items, keysOnly = false }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="mt-3 max-h-40 space-y-2 overflow-y-auto text-sm text-slate-300">
        {items.length ? (
          items.map((item, index) => (
            <p key={`${title}-${index}`}>
              {keysOnly
                ? `${item.key} repeated ${item.count} times`
                : `${item.expected} → ${item.typed}`}
            </p>
          ))
        ) : (
          <p className="text-slate-500">No repeated mistakes detected.</p>
        )}
      </div>
    </div>
  );
}

export default SscStenoTest;
