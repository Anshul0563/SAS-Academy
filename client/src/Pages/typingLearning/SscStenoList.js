import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  FileText,
  Gauge,
  Languages,
  Search,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  sscStenoCategories,
  sscStenoParagraphs,
} from "./sscStenoData";
import { formatSeconds } from "./sscStenoAnalytics";

const difficulties = ["all", "intermediate", "advanced", "expert"];
const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Duration", value: "duration" },
  { label: "Target WPM", value: "wpm" },
  { label: "Word Count", value: "words" },
];

function SscStenoList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  const filteredParagraphs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sscStenoParagraphs
      .filter((paragraph) => {
        const matchesCategory =
          category === "All" || paragraph.category === category;
        const matchesDifficulty =
          difficulty === "all" || paragraph.difficulty === difficulty;
        const searchable = `${paragraph.title} ${paragraph.category} ${paragraph.practiceType} ${paragraph.paragraphText}`.toLowerCase();
        const matchesQuery =
          !normalizedQuery || searchable.includes(normalizedQuery);

        return matchesCategory && matchesDifficulty && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "duration") return b.duration - a.duration;
        if (sortBy === "wpm") return b.targetWPM - a.targetWPM;
        if (sortBy === "words") return b.wordCount - a.wordCount;
        return b.accuracyGoal - a.accuracyGoal || b.targetWPM - a.targetWPM;
      });
  }, [category, difficulty, query, sortBy]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 text-white">
      <header className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Typing Learning / SSC Steno Test
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
              SSC Steno paragraph library
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Formal government-style dictation and transcription passages for
              stamina, accuracy, and SSC Steno exam control.
            </p>
          </div>

          <div className="grid gap-2 rounded-md border border-white/10 bg-slate-950/50 p-3 text-xs sm:grid-cols-3 lg:min-w-[440px]">
            <Summary label="Paragraphs" value={sscStenoParagraphs.length} />
            <Summary
              label="Avg target"
              value={`${Math.round(
                sscStenoParagraphs.reduce(
                  (sum, item) => sum + item.targetWPM,
                  0,
                ) / sscStenoParagraphs.length,
              )} WPM`}
            />
            <Summary label="Exam mode" value="Backspace off" />
          </div>
        </div>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search paragraph, theme, or practice type..."
              className="w-full rounded-md border border-white/10 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-emerald-300/50"
            />
          </label>

          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none"
          >
            {difficulties.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All difficulty" : item}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none"
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                Sort: {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {sscStenoCategories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition ${
                category === item
                  ? "bg-indigo-600 text-white"
                  : "border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredParagraphs.map((paragraph, index) => (
          <motion.article
            key={paragraph.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl transition hover:border-emerald-300/30 hover:bg-white/[0.06] sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                    {paragraph.category}
                  </span>
                  <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    {paragraph.difficulty}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {paragraph.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                  {paragraph.paragraphText}
                </p>
              </div>

              <button
                onClick={() => navigate(`/typing-learning/ssc-steno/${paragraph.id}`)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold transition hover:bg-emerald-500"
              >
                Start
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <Metric icon={Clock3} label="Duration" value={formatSeconds(paragraph.duration)} />
              <Metric icon={FileText} label="Words" value={paragraph.wordCount} />
              <Metric icon={Gauge} label="Target" value={`${paragraph.targetWPM} WPM`} />
              <Metric icon={Target} label="Accuracy" value={`${paragraph.accuracyGoal}%`} />
              <Metric icon={Languages} label="Language" value={paragraph.language} />
              <Metric icon={FileText} label="Type" value={paragraph.practiceType} />
            </div>
          </motion.article>
        ))}
      </section>

      {!filteredParagraphs.length && (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-400">
          No SSC Steno paragraph matched the selected filters.
        </div>
      )}
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 truncate text-sm font-semibold capitalize text-white">
        {value}
      </p>
    </div>
  );
}

export default SscStenoList;
