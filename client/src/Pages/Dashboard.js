import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { getUserAuthToken } from "../utils/authStorage";

import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpenText,
  Clock3,
  FileText,
  Headphones,
  Mail,
  Medal,
  Phone,
  Play,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDate = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

const getDefaultDuration = (test) => (test?.type === "dictation" ? 10 : 50);
const getDisplayDuration = (test) => {
  const duration = Number(test?.duration);
  return !duration || duration === 5 ? getDefaultDuration(test) : duration;
};
const formatScoreNumber = (value, digits = 1) =>
  Number(value || 0).toFixed(digits);
const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));
const getCompositeScore = (entry) =>
  Math.round(
    clampScore(entry.accuracy) * 0.65 +
      Math.min(100, Number(entry.netWPM || 0) * 2) * 0.25 +
      Math.min(100, Number(entry.grossWPM || 0) * 1.5) * 0.1,
  );
const getAccuracyTone = (value) => {
  const accuracy = Number(value) || 0;
  if (accuracy >= 90) return "text-emerald-300";
  if (accuracy >= 75) return "text-amber-200";
  return "text-red-300";
};
const getPerformanceLabel = (entry) => {
  const score = getCompositeScore(entry);
  if (score >= 90) return "Elite";
  if (score >= 78) return "Advanced";
  if (score >= 62) return "Steady";
  return "Building";
};
const formatDuration = (seconds = 0) => {
  const minutes = Number(seconds || 0) / 60;
  return minutes >= 1 ? `${minutes.toFixed(1)} min` : `${seconds || 0}s`;
};

function Dashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get("/tests");
        setTests(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Dashboard tests error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchLeaderboard = async () => {
      const token = getUserAuthToken();
      if (!token) {
        setLeaderboardLoading(false);
        return;
      }

      try {
        const res = await API.get("/results/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) {
          setLeaderboard(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
        }
      } catch (err) {
        console.error("Dashboard leaderboard error:", err);
      } finally {
        if (!cancelled) setLeaderboardLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const metrics = useMemo(() => {
    const transcription = tests.filter(
      (test) => test.type === "transcription",
    ).length;
    const dictation = tests.filter((test) => test.type === "dictation").length;
    const categories = new Set(
      tests.map((test) => test.category).filter(Boolean),
    ).size;
    const averageTime = tests.length
      ? Math.round(
          tests.reduce((total, test) => total + getDisplayDuration(test), 0) /
            tests.length,
        )
      : 0;

    return [
      {
        label: "Available Tests",
        value: tests.length,
        icon: BarChart3,
        tone: "text-emerald-300",
        bg: "bg-emerald-400/10",
      },
      {
        label: "Transcription",
        value: transcription,
        icon: FileText,
        tone: "text-sky-300",
        bg: "bg-sky-400/10",
      },
      {
        label: "Dictation",
        value: dictation,
        icon: Headphones,
        tone: "text-amber-200",
        bg: "bg-amber-400/10",
      },
      {
        label: "Avg Duration",
        value: averageTime ? `${averageTime}m` : "0m",
        icon: Clock3,
        tone: "text-violet-200",
        bg: "bg-violet-400/10",
      },
      {
        label: "Categories",
        value: categories,
        icon: Award,
        tone: "text-rose-200",
        bg: "bg-rose-400/10",
      },
    ];
  }, [tests]);

  const topEntry = leaderboard[0];
  const leaderboardStats = useMemo(() => {
    if (!leaderboard.length) {
      return {
        averageAccuracy: 0,
        averageNetWPM: 0,
        cleanestErrors: 0,
      };
    }

    const totals = leaderboard.reduce(
      (summary, entry) => ({
        accuracy: summary.accuracy + Number(entry.accuracy || 0),
        netWPM: summary.netWPM + Number(entry.netWPM || 0),
        errors: summary.errors + Number(entry.errors || 0),
      }),
      { accuracy: 0, netWPM: 0, errors: 0 },
    );

    return {
      averageAccuracy: totals.accuracy / leaderboard.length,
      averageNetWPM: totals.netWPM / leaderboard.length,
      cleanestErrors: Math.min(
        ...leaderboard.map((entry) => Number(entry.errors || 0)),
      ),
    };
  }, [leaderboard]);

  const recentTests = tests.slice(0, 5);
  const featuredTest = tests[0];
  const quickPracticeTest =
    tests.find((test) => test.type === "transcription") ||
    tests.find((test) => test.type !== "dictation");
  const quickPracticePath = quickPracticeTest
    ? `/typing-settings/${quickPracticeTest._id}`
    : "/transcription";
  const topCategories = useMemo(() => {
    const counts = tests.reduce((acc, test) => {
      const key = test.category || "General";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [tests]);

  const quickActions = [
    {
      title: "Start Speed Test",
      detail: "Quick timed transcription practice",
      icon: Play,
      to: quickPracticePath,
      accent: "bg-emerald-500",
    },
    {
      title: "Transcription Library",
      detail: "Browse typing passages by exam type",
      icon: BookOpenText,
      to: "/transcription",
      accent: "bg-sky-500",
    },
    {
      title: "Dictation Practice",
      detail: "Train listening and typing together",
      icon: Headphones,
      to: "/dictations",
      accent: "bg-amber-500",
    },
  ];

  return (
    <div className="text-white">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  {formatDate()}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {user.name
                    ? `Welcome back, ${user.name}`
                    : "Typing Practice Dashboard"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Choose a test, configure exam rules, and track a clean scoring
                  flow built around speed, accuracy, and consistency.
                </p>
              </div>

              <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck size={16} />
                  Exam Mode Ready
                </div>
                <p className="mt-1 text-xs text-emerald-100/75">
                  Backspace, timer, font, punctuation, and case rules are
                  configurable before each test.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate(quickPracticePath)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                <Play size={18} /> Start Practice
              </button>
              <button
                onClick={() => navigate("/transcription")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                <Search size={18} /> Browse Library
              </button>
            </div>
          </motion.div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
            <p className="text-sm font-semibold text-slate-200">
              Recommended Next
            </p>
            {featuredTest ? (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <span className="rounded bg-white/10 px-2 py-1 capitalize">
                    {featuredTest.type || "practice"}
                  </span>
                  <span>{getDisplayDuration(featuredTest)} min</span>
                </div>
                <h2 className="mt-3 line-clamp-2 text-xl font-semibold">
                  {featuredTest.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {featuredTest.category || "General"} practice set
                </p>
                <button
                  onClick={() =>
                    navigate(
                      featuredTest.type === "dictation"
                        ? `/dictation/${featuredTest._id}`
                        : `/typing-settings/${featuredTest._id}`,
                    )
                  }
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                {loading
                  ? "Loading tests..."
                  : "No practice tests are available yet."}
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-md ${item.bg}`}
                >
                  <Icon className={item.tone} size={19} />
                </div>
                <p className="text-2xl font-bold">
                  {loading ? "..." : item.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {item.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-400/10 text-amber-200">
                <Trophy size={19} />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Advanced Scoreboard</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Ranked by accuracy, net WPM, gross speed, and latest best
                  attempt.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[420px]">
              <ScoreSummary
                label="Avg accuracy"
                value={`${formatScoreNumber(leaderboardStats.averageAccuracy)}%`}
              />
              <ScoreSummary
                label="Avg net"
                value={formatScoreNumber(leaderboardStats.averageNetWPM)}
              />
              <ScoreSummary
                label="Fewest errors"
                value={leaderboardStats.cleanestErrors}
              />
            </div>
          </div>

          {leaderboardLoading ? (
            <div className="mt-4 rounded-md border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-400">
              Loading scoreboard...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="mt-4 rounded-md border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-400">
              Scores will appear after students submit tests.
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 lg:grid-cols-[0.9fr_1.4fr]">
                <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-100">
                        Current leader
                      </p>
                      <h3 className="mt-2 truncate text-2xl font-bold text-white">
                        {topEntry.userName || "Unknown"}
                      </h3>
                      <p className="mt-1 truncate text-sm text-amber-100/80">
                        {topEntry.testTitle || "Test"}
                      </p>
                    </div>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-amber-300 text-slate-950">
                      <Medal size={24} />
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <ScoreSummary
                      label="Accuracy"
                      value={`${formatScoreNumber(topEntry.accuracy)}%`}
                      strong
                    />
                    <ScoreSummary
                      label="Net WPM"
                      value={formatScoreNumber(topEntry.netWPM)}
                      strong
                    />
                    <ScoreSummary
                      label="Rating"
                      value={getCompositeScore(topEntry)}
                      strong
                    />
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {leaderboard.slice(0, 3).map((entry, index) => (
                    <div
                      key={entry._id}
                      className="rounded-md border border-white/10 bg-slate-950/45 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <RankBadge rank={index + 1} />
                        <span className="rounded-md border border-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                          {getPerformanceLabel(entry)}
                        </span>
                      </div>
                      <p className="mt-3 truncate font-semibold text-white">
                        {entry.userName || "Unknown"}
                      </p>
                      <ScoreBar
                        label="Accuracy"
                        value={entry.accuracy}
                        tone="bg-emerald-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-md border border-white/10 bg-slate-950/35">
                <div className="hidden grid-cols-[4rem_1.4fr_1fr_0.85fr_0.85fr_0.75fr_1.2fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
                  <span>Rank</span>
                  <span>Student</span>
                  <span>Accuracy</span>
                  <span>Net WPM</span>
                  <span>Gross</span>
                  <span>Errors</span>
                  <span>Best attempt</span>
                </div>

                <div className="divide-y divide-white/10">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry._id}
                      className="grid gap-3 px-4 py-3 text-sm xl:grid-cols-[4rem_1.4fr_1fr_0.85fr_0.85fr_0.75fr_1.2fr] xl:items-center"
                    >
                      <RankBadge rank={index + 1} />
                      <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-white">
                            {entry.userName || "Unknown"}
                          </p>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                            {getPerformanceLabel(entry)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {entry.correctWords || 0}/{entry.totalWords || 0}{" "}
                          correct
                        </p>
                      </div>
                      <ScoreBar
                        label="Accuracy"
                        value={entry.accuracy}
                        suffix="%"
                        tone="bg-emerald-300"
                      />
                      <ScoreStat
                        label="Net WPM"
                        value={formatScoreNumber(entry.netWPM)}
                        tone="text-emerald-300"
                      />
                      <ScoreStat
                        label="Gross"
                        value={formatScoreNumber(entry.grossWPM)}
                        tone="text-sky-300"
                      />
                      <ScoreStat
                        label="Errors"
                        value={entry.errors || 0}
                        tone={
                          Number(entry.errors || 0) <=
                          leaderboardStats.cleanestErrors
                            ? "text-emerald-300"
                            : "text-red-300"
                        }
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-200">
                          {entry.testTitle || "Test"}
                        </p>
                        <p className="mt-0.5 text-xs capitalize text-slate-500">
                          {entry.testType || "practice"} /{" "}
                          {formatDuration(entry.timeTaken)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.to)}
                    className="group flex w-full items-center gap-3 rounded-md border border-white/10 bg-slate-950/40 p-3 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded ${action.accent}`}
                    >
                      <Icon size={18} className="text-slate-950" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">
                        {action.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {action.detail}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Recent Tests</h2>
              <button
                onClick={() => navigate("/transcription")}
                className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                View all
              </button>
            </div>

            <div className="mt-4 divide-y divide-white/10 rounded-md border border-white/10 bg-slate-950/35">
              {recentTests.length === 0 ? (
                <div className="p-4 text-sm text-slate-400">
                  {loading ? "Loading tests..." : "No tests available yet."}
                </div>
              ) : (
                recentTests.map((test) => (
                  <button
                    key={test._id}
                    onClick={() =>
                      navigate(
                        test.type === "dictation"
                          ? `/dictation/${test._id}`
                          : `/typing-settings/${test._id}`,
                      )
                    }
                    className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/[0.06]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                      {test.type === "dictation" ? (
                        <Headphones size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">
                        {test.title}
                      </span>
                      <span className="mt-0.5 block text-xs capitalize text-slate-400">
                        {test.type || "test"} / {test.category || "General"}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">
                      {getDisplayDuration(test)}m
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h2 className="text-lg font-semibold">Focus Areas</h2>
            <div className="mt-4 space-y-3">
              {topCategories.length ? (
                topCategories.map(([category, count]) => (
                  <div key={category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="truncate text-slate-300">
                        {category}
                      </span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{
                          width: `${Math.max(14, Math.min(100, (count / Math.max(1, tests.length)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  {loading
                    ? "Loading categories..."
                    : "Categories will appear after tests are added."}
                </p>
              )}
            </div>

            <div className="mt-5 rounded-md bg-slate-950/50 p-3 text-sm text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Target size={16} className="text-emerald-300" />
                Daily target
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Complete one timed transcription and review every highlighted
                mistake on the result page.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-300 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-300" />
            Net WPM rewards correct strokes.
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-sky-300" />
            +91 8178844795
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-amber-200" />
            support@sasacademy.in
          </div>
        </section>
      </div>
    </div>
  );
}

function ScoreStat({ label, value, tone }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 md:hidden">
        {label}
      </p>
      <p className={`font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function ScoreSummary({ label, value, strong = false }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/45 px-3 py-2">
      <p
        className={`font-semibold ${strong ? "text-lg text-white" : "text-sm text-slate-100"}`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function RankBadge({ rank }) {
  const styles = {
    1: "border-amber-300/40 bg-amber-300 text-slate-950",
    2: "border-slate-200/40 bg-slate-200 text-slate-950",
    3: "border-orange-400/40 bg-orange-400 text-slate-950",
  };

  return (
    <span
      className={`inline-flex h-9 w-11 items-center justify-center rounded-md border text-sm font-bold ${
        styles[rank] || "border-white/10 bg-white/10 text-slate-200"
      }`}
    >
      #{rank}
    </span>
  );
}

function ScoreBar({ label, value, suffix = "%", tone = "bg-emerald-300" }) {
  const score = clampScore(value);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">
          {label}
        </p>
        <p className={`text-sm font-semibold ${getAccuracyTone(value)}`}>
          {formatScoreNumber(value)}
          {suffix}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
