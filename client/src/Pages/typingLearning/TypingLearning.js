import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Gauge,
  Keyboard,
  Languages,
  Maximize2,
  RotateCcw,
  Save,
  Target,
  Trophy,
} from "lucide-react";

import API from "../../api/axios";
import { getUserAuthToken } from "../../utils/authStorage";
import {
  fingerLessons,
  keyboardRows,
  modeConfig,
  passages,
} from "./typingLearningData";
import {
  calculateTypingStats,
  formatTime,
  getCharacterState,
} from "./typingMetrics";

const tabs = ["Dashboard", "Practice", "Lessons", "Analytics"];

const getHeaders = () => {
  const token = getUserAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function TypingLearning() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mode, setMode] = useState("practice");
  const [language, setLanguage] = useState("english");
  const [passageIndex, setPassageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(modeConfig.practice.duration);
  const [backspaces, setBackspaces] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const config = modeConfig[mode];
  const passageSet = passages[language];
  const passage = passageSet[passageIndex % passageSet.length];
  const durationSeconds = 600;
  const elapsedSeconds = Math.max(1, durationSeconds - timeLeft);
  const stats = useMemo(
    () =>
      calculateTypingStats({
        source: passage.text,
        typed: typedText,
        elapsedSeconds,
      }),
    [elapsedSeconds, passage.text, typedText],
  );

  const coach = progress?.coach || {
    headline: "Start with a short accuracy drill.",
    tips: [
      "Keep your rhythm steady before increasing speed.",
      "Repeat weak keys immediately after every attempt.",
      "Use SSC simulation when accuracy stays above 90%.",
    ],
    weakKeys: stats.weakKeys,
    trend: "Live attempt in progress",
  };

  useEffect(() => {
    let cancelled = false;

    const loadTypingData = async () => {
      try {
        const [progressRes, leaderboardRes] = await Promise.all([
          API.get("/typing-learning/progress", { headers: getHeaders() }),
          API.get("/typing-learning/leaderboard", { headers: getHeaders() }),
        ]);

        if (!cancelled) {
          setProgress(progressRes.data || null);
          setLeaderboard(
            Array.isArray(leaderboardRes.data) ? leaderboardRes.data : [],
          );
        }
      } catch (error) {
        console.error("Typing learning load error:", error);
      }
    };

    loadTypingData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!started || completed) return undefined;
    if (timeLeft <= 0 || typedText.length >= passage.text.length) {
      setCompleted(true);
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [completed, passage.text.length, started, timeLeft, typedText.length]);

  useEffect(() => {
    if (!started && !typedText) {
      setTimeLeft(durationSeconds);
    }
  }, [durationSeconds, started, typedText]);

  const resetAttempt = (nextMode = mode, nextLanguage = language) => {
    setMode(nextMode);
    setLanguage(nextLanguage);
    setPassageIndex(0);
    setTypedText("");
    setStarted(false);
    setCompleted(false);
    setBackspaces(0);
    setTimeLeft(
      passages[nextLanguage][0]?.duration || modeConfig[nextMode].duration,
    );
    setSaveMessage("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleModeChange = (nextMode) => {
    resetAttempt(nextMode, language);
    setActiveTab("Practice");
  };

  const handleLanguageChange = (nextLanguage) => {
    resetAttempt(mode, nextLanguage);
  };

  const handleInput = (event) => {
    if (!started) setStarted(true);
    setTypedText(event.target.value.slice(0, passage.text.length + 20));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setBackspaces((value) => value + 1);
      if (config.backspaceDisabled) {
        event.preventDefault();
      }
    }
  };

  const saveAttempt = async () => {
    setSaving(true);
    setSaveMessage("");

    try {
      const payload = {
        ...stats,
        mode,
        language,
        passageTitle: passage.title,
        durationSeconds,
        timeTaken: elapsedSeconds,
        backspaceDisabled: config.backspaceDisabled,
        backspaces,
      };

      await API.post("/typing-learning/results", payload, {
        headers: getHeaders(),
      });

      const [progressRes, leaderboardRes] = await Promise.all([
        API.get("/typing-learning/progress", { headers: getHeaders() }),
        API.get("/typing-learning/leaderboard", { headers: getHeaders() }),
      ]);

      setProgress(progressRes.data || null);
      setLeaderboard(
        Array.isArray(leaderboardRes.data) ? leaderboardRes.data : [],
      );
      setSaveMessage("Attempt saved");
    } catch (error) {
      console.error("Typing result save error:", error);
      setSaveMessage("Attempt calculated locally");
    } finally {
      setSaving(false);
    }
  };

  const openFullscreen = () => {
    containerRef.current?.requestFullscreen?.();
  };

  const nextCharacter = passage.text[typedText.length]?.toUpperCase();

  return (
    <div ref={containerRef} className="min-h-dvh text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-5">
        <header className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Typing Learning System
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
                SSC typing practice studio
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Practice, simulation, lessons, analytics, and coaching in one
                SAS Academy workspace.
              </p>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        {activeTab === "Dashboard" && (
          <DashboardPanel
            progress={progress}
            leaderboard={leaderboard}
            stats={stats}
            onStart={handleModeChange}
          />
        )}

        {activeTab === "Practice" && (
          <PracticePanel
            mode={mode}
            config={config}
            language={language}
            passage={passage}
            durationSeconds={durationSeconds}
            passageSet={passageSet}
            passageIndex={passageIndex}
            typedText={typedText}
            timeLeft={timeLeft}
            stats={stats}
            completed={completed}
            backspaces={backspaces}
            saving={saving}
            saveMessage={saveMessage}
            nextCharacter={nextCharacter}
            inputRef={inputRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onModeChange={handleModeChange}
            onLanguageChange={handleLanguageChange}
            onPassageChange={(index) => {
              setPassageIndex(index);
              setTypedText("");
              setStarted(false);
              setCompleted(false);
              setBackspaces(0);
              setTimeLeft(600);
            }}
            onReset={() => resetAttempt(mode, language)}
            onSave={saveAttempt}
            onFullscreen={openFullscreen}
          />
        )}

        {activeTab === "Lessons" && (
          <LessonsPanel nextCharacter={nextCharacter} language={language} />
        )}

        {activeTab === "Analytics" && (
          <AnalyticsPanel
            progress={progress}
            coach={coach}
            leaderboard={leaderboard}
            liveWeakKeys={stats.weakKeys}
          />
        )}
      </div>
    </div>
  );
}

function DashboardPanel({ progress, leaderboard, stats, onStart }) {
  const cards = [
    {
      label: "Average WPM",
      value: Number(progress?.averageWPM || 0).toFixed(1),
      icon: Gauge,
      tone: "text-emerald-300",
    },
    {
      label: "Average Accuracy",
      value: `${Number(progress?.averageAccuracy || 0).toFixed(1)}%`,
      icon: Target,
      tone: "text-amber-200",
    },
    {
      label: "Attempts",
      value: progress?.attempts || 0,
      icon: BarChart3,
      tone: "text-sky-300",
    },
    {
      label: "Live WPM",
      value: Number(stats.wpm || 0).toFixed(1),
      icon: Clock3,
      tone: "text-violet-200",
    },
  ];

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl"
            >
              <Icon size={18} className={item.tone} />
              <p className={`mt-4 text-2xl font-bold sm:text-3xl ${item.tone}`}>
                {item.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {item.label}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
          <div className="flex items-start gap-3 sm:items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-200">
              <Keyboard size={19} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">Training modules</h2>
              <p className="text-xs text-slate-400">
                SSC, accuracy, speed, no-backspace, Hindi, and English modes.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Object.entries(modeConfig).map(([key, item]) => (
              <button
                key={key}
                onClick={() => onStart(key)}
                className="rounded-md border border-white/10 bg-slate-950/60 p-3 text-left transition hover:border-indigo-300/40 hover:bg-indigo-500/10 sm:p-4"
              >
                <p className="font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {formatTime(item.duration)} /{" "}
                  {item.backspaceDisabled ? "No backspace" : "Backspace on"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <LeaderboardPanel leaderboard={leaderboard} compact />
      </section>
    </>
  );
}

function PracticePanel({
  mode,
  config,
  language,
  passage,
  durationSeconds,
  passageSet,
  passageIndex,
  typedText,
  timeLeft,
  stats,
  completed,
  backspaces,
  saving,
  saveMessage,
  nextCharacter,
  inputRef,
  onInput,
  onKeyDown,
  onModeChange,
  onLanguageChange,
  onPassageChange,
  onReset,
  onSave,
  onFullscreen,
}) {
  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
      {/* MAIN PRACTICE AREA */}
      <div className="min-w-0 rounded-3xl border border-white/10 bg-[#020817]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        {/* CLEAN HEADER */}
        <div className="border-b border-white/10 pb-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                SSC Typing Practice
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                {passage.title}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {passage.difficulty} • {passage.targetWPM} WPM •{" "}
                {formatTime(timeLeft)}
              </p>
            </div>

            {/* LANGUAGE TOGGLE */}
            <div className="flex gap-2">
              {["english", "hindi"].map((item) => (
                <button
                  key={item}
                  onClick={() => onLanguageChange(item)}
                  className={`rounded-2xl px-5 py-2.5 text-sm font-semibold capitalize transition ${
                    language === item
                      ? "bg-indigo-600 text-white"
                      : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* MINIMAL STATS */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#0b1120]/70 p-4">
              <p className="text-2xl font-bold text-white">
                {formatTime(timeLeft)}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                Time
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1120]/70 p-4">
              <p className="text-2xl font-bold text-emerald-300">
                {stats.wpm.toFixed(1)}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                WPM
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1120]/70 p-4">
              <p className="text-2xl font-bold text-amber-200">
                {stats.accuracy.toFixed(1)}%
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                Accuracy
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1120]/70 p-4">
              <p className="text-2xl font-bold text-red-300">{stats.errors}</p>

              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                Errors
              </p>
            </div>
          </div>
        </div>
        {/* PASSAGE CAROUSEL */}
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="flex gap-3">
            {passageSet.slice(0, 10).map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => onPassageChange(index)}
                className={`min-w-[220px] rounded-2xl border p-4 text-left transition ${
                  passageIndex === index
                    ? "border-indigo-400/40 bg-indigo-500/10"
                    : "border-white/10 bg-[#0b1120]/60 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Practice {index + 1}
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-200">
                    10 MIN
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white">
                  {item.title}
                </h3>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.difficulty}</span>
                  <span>{item.targetWPM} WPM</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SOURCE PARAGRAPH */}
        <CharacterDisplay source={passage.text} typed={typedText} />

        {/* TEXTAREA */}
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={onInput}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          placeholder="Start typing here..."
          className="mt-5 h-[42vh] min-h-[320px] w-full resize-none rounded-3xl border border-white/10 bg-[#020617]/95 px-6 py-6 text-[20px] leading-[3rem] tracking-normal text-white shadow-inner outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-emerald-300/40"
        />

        {/* ACTIONS */}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={onFullscreen}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <Maximize2 size={16} />
            Fullscreen
          </button>

          {completed && (
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Attempt"}
            </button>
          )}
        </div>

        {saveMessage && (
          <p className="mt-4 text-sm text-emerald-300">{saveMessage}</p>
        )}
      </div>

      {/* CLEAN SIDE PANEL */}
      <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
        <CoachCard
          headline={
            completed ? "Attempt completed" : "Focus on rhythm and accuracy"
          }
          weakKeys={stats.weakKeys}
          tips={[
            "Maintain steady rhythm while typing.",
            "Avoid unnecessary corrections.",
          ]}
        />
      </aside>
    </section>
  );
}


function CharacterDisplay({ source, typed }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  const typedChars = Array.from(typed);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [typed]);

  return (
    <div
      ref={containerRef}
      className="mt-5 max-h-[420px] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1120]/80 p-6 shadow-inner"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Source Paragraph
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              Maintain rhythm and accuracy
            </h3>
          </div>

          <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100">
            Live Tracking
          </div>
        </div>

        <div className="rounded-2xl bg-[#020817]/80 p-5 sm:p-6">
          <p className="break-words whitespace-pre-wrap text-[19px] leading-[2.9rem] tracking-normal text-slate-300 sm:text-[21px] sm:leading-[3.1rem]">
            {Array.from(source).map((char, index) => {
              const typedChar = typedChars[index];

              const state = getCharacterState(char, typedChar);

              const active = index === typedChars.length;

              const className =
                state === "correct"
                  ? "text-emerald-200"
                  : state === "wrong"
                    ? "text-red-300"
                    : active
                      ? "bg-indigo-500/15 text-white"
                      : "text-slate-500";

              return (
                <span
                  ref={active ? activeRef : null}
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
function LessonsPanel({ nextCharacter, language }) {
  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={19} />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Finger placement lessons</h2>
            <p className="text-xs text-slate-400">
              Home-row discipline for English and Hindi typing practice.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {fingerLessons.map((lesson) => (
            <div
              key={lesson.zone}
              className="rounded-md border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-white">{lesson.zone}</p>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                  {lesson.keys}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{lesson.note}</p>
              <p className="mt-3 overflow-x-auto rounded-md bg-white/5 px-3 py-2 font-mono text-sm text-emerald-100">
                {lesson.drill}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        <VirtualKeyboard activeKey={nextCharacter} />
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
          <div className="flex items-start gap-3 sm:items-center">
            <Languages className="text-sky-300" size={19} />
            <h2 className="text-lg font-semibold">Hindi + English support</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <LanguageCard title="English" active={language === "english"} />
            <LanguageCard title="Hindi" active={language === "hindi"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsPanel({ progress, coach, leaderboard, liveWeakKeys }) {
  return (
    <section className="grid min-w-0 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="min-w-0 flex flex-col gap-4">
        <CoachCard
          headline={coach.headline}
          weakKeys={coach.weakKeys?.length ? coach.weakKeys : liveWeakKeys}
          tips={coach.tips}
          trend={coach.trend}
        />
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
          <h2 className="text-lg font-semibold">User progress tracking</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <ProgressStat
              label="Best WPM"
              value={Number(progress?.bestWPM || 0).toFixed(1)}
            />
            <ProgressStat
              label="Best Accuracy"
              value={`${Number(progress?.bestAccuracy || 0).toFixed(1)}%`}
            />
            <ProgressStat
              label="Total Errors"
              value={progress?.totalErrors || 0}
            />
            <ProgressStat
              label="Saved Attempts"
              value={progress?.attempts || 0}
            />
          </div>
        </div>
      </div>

      <LeaderboardPanel leaderboard={leaderboard} />
    </section>
  );
}

function CoachCard({ headline, weakKeys = [], tips = [], trend }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-fuchsia-400/10 text-fuchsia-200">
          <Brain size={19} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">AI Typing Coach</h2>
          <p className="text-xs text-slate-400">{headline}</p>
        </div>
      </div>

      {trend && (
        <p className="mt-4 rounded-md border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
          {trend}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {weakKeys.length ? (
          weakKeys.map((item) => (
            <span
              key={item.key}
              className="rounded-md border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-100"
            >
              {item.key} / {item.count}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-400">
            Weak keys will appear here.
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {tips.map((tip) => (
          <p key={tip} className="text-sm leading-6 text-slate-300">
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
}

function VirtualKeyboard({ activeKey }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
      <div className="flex items-center gap-3">
        <Keyboard className="text-emerald-300" size={19} />
        <h2 className="text-lg font-semibold">Virtual keyboard</h2>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="min-w-[19rem] space-y-2 sm:min-w-0">
          {keyboardRows.map((row, rowIndex) => (
            <div
              key={row.join("")}
              className={`flex justify-center gap-1 ${rowIndex === 1 ? "px-4 sm:pr-5" : ""}`}
            >
              {row.map((key) => {
                const active = activeKey === key;
                return (
                  <span
                    key={key}
                    className={`flex h-9 min-w-7 flex-1 items-center justify-center rounded-md border text-xs font-semibold sm:h-10 sm:min-w-9 sm:text-sm ${
                      active
                        ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                        : "border-white/10 bg-slate-950/60 text-slate-300"
                    }`}
                  >
                    {key}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeaderboardPanel({ leaderboard, compact = false }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-400/10 text-amber-200">
          <Trophy size={19} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Typing leaderboard</h2>
          <p className="text-xs text-slate-400">Top saved learning attempts.</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-md border border-white/10 bg-slate-950/50">
        {leaderboard.length ? (
          leaderboard.slice(0, compact ? 5 : 10).map((entry, index) => (
            <div
              key={entry._id}
              className="grid grid-cols-[2.6rem_minmax(0,1fr)] gap-3 px-3 py-3 text-sm sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
            >
              <span className="flex h-8 w-10 items-center justify-center rounded-md bg-white/10 font-bold text-slate-200">
                #{index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {entry.userName || "Unknown"}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {entry.mode || "practice"} / {entry.language || "english"}
                </p>
              </div>
              <div className="col-start-2 text-left sm:col-start-auto sm:text-right">
                <p className="font-semibold text-emerald-300">
                  {Number(entry.wpm || 0).toFixed(1)} WPM
                </p>
                <p className="text-xs text-amber-200">
                  {Number(entry.accuracy || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-slate-400">No saved attempts yet.</p>
        )}
      </div>
    </div>
  );
}

function ProgressStat({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function LanguageCard({ title, active }) {
  return (
    <div
      className={`rounded-md border p-4 ${
        active
          ? "border-emerald-300/40 bg-emerald-400/10"
          : "border-white/10 bg-slate-950/60"
      }`}
    >
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">
        {title === "Hindi"
          ? "Unicode Hindi passage support for practice drills."
          : "Standard English typing and SSC passage practice."}
      </p>
    </div>
  );
}

export default TypingLearning;
