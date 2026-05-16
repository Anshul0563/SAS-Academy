import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
 Download,
  Gauge,
  Keyboard,
  MinusCircle,
  PlusCircle,
  RefreshCcw,
  Target,
  Timer,
  XCircle,
} from "lucide-react";

import API from "../api/axios";
import { useExam } from "../context/ExamContext";
import { getUserAuthToken } from "../utils/authStorage";

const clean = (text = "", options = {}) => {
  let value = String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  if (options.ignoreCase) {
    value = value.toLowerCase();
  }

  if (options.ignorePunctuation) {
    value = value.replace(/[^\w\s]|_/g, "");
  }

  return value;
};

const getUnits = (originalText, typedText, options) => {
  const original = clean(originalText, options);
  const typed = clean(typedText, options);

  const characterMode = Boolean(
    typed &&
      !typed.includes(" ") &&
      !original.includes(" ")
  );

  if (characterMode) {
    return {
      mode: "characters",
      originalUnits: original.replace(/\s/g, "").split(""),
      typedUnits: typed.replace(/\s/g, "").split(""),
    };
  }

  return {
    mode: "words",
    originalUnits: original ? original.split(" ") : [],
    typedUnits: typed ? typed.split(" ") : [],
  };
};

const round = (value, decimals = 2) =>
  Number(Number(value || 0).toFixed(decimals));

const formatNumber = (value, decimals = 1) => {
  const number = Number(value || 0);

  return number % 1 === 0
    ? String(number)
    : number.toFixed(decimals);
};

const formatTime = (seconds = 0) => {
  const value = Math.max(0, Number(seconds) || 0);

  const minutes = Math.floor(value / 60);

  const remainingSeconds = String(
    Math.floor(value % 60)
  ).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const buildLinearComparison = (
  originalUnits,
  typedUnits
) => {
  const comparison = [];

  let i = 0;
  let j = 0;

  while (
    i < originalUnits.length ||
    j < typedUnits.length
  ) {
    const expected = originalUnits[i] || "";
    const typed = typedUnits[j] || "";

    if (
      expected &&
      typed &&
      expected === typed
    ) {
      comparison.push({
        expected,
        typed,
        word: typed,
        type: "correct",
      });

      i += 1;
      j += 1;
    }

    else if (
      typed &&
      originalUnits[i] === typedUnits[j + 1]
    ) {
      comparison.push({
        expected: "",
        typed,
        word: typed,
        type: "addition",
      });

      j += 1;
    }

    else if (
      expected &&
      originalUnits[i + 1] === typedUnits[j]
    ) {
      comparison.push({
        expected,
        typed: "",
        word: expected,
        type: "omission",
      });

      i += 1;
    }

    else if (expected && typed) {
      comparison.push({
        expected,
        typed,
        word: typed,
        type: "spelling",
      });

      i += 1;
      j += 1;
    }

    else if (typed) {
      comparison.push({
        expected: "",
        typed,
        word: typed,
        type: "addition",
      });

      j += 1;
    }

    else {
      comparison.push({
        expected,
        typed: "",
        word: expected,
        type: "omission",
      });

      i += 1;
    }
  }

  return comparison;
};

const buildWordComparison = (
  originalWords,
  typedWords
) => {
  const rows = originalWords.length;
  const cols = typedWords.length;

  const dp = Array.from(
    { length: rows + 1 },
    () => Array(cols + 1).fill(0)
  );

  for (let i = 0; i <= rows; i += 1) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= cols; j += 1) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= rows; i += 1) {
    for (let j = 1; j <= cols; j += 1) {
      const cost =
        originalWords[i - 1] === typedWords[j - 1]
          ? 0
          : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const comparison = [];

  let i = rows;
  let j = cols;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      originalWords[i - 1] ===
        typedWords[j - 1]
    ) {
      comparison.unshift({
        expected: originalWords[i - 1],
        typed: typedWords[j - 1],
        word: typedWords[j - 1],
        type: "correct",
      });

      i -= 1;
      j -= 1;
    }

    else if (
      j > 0 &&
      dp[i][j] === dp[i][j - 1] + 1
    ) {
      comparison.unshift({
        expected: "",
        typed: typedWords[j - 1],
        word: typedWords[j - 1],
        type: "addition",
      });

      j -= 1;
    }

    else if (
      i > 0 &&
      dp[i][j] === dp[i - 1][j] + 1
    ) {
      comparison.unshift({
        expected: originalWords[i - 1],
        typed: "",
        word: originalWords[i - 1],
        type: "omission",
      });

      i -= 1;
    }

    else {
      comparison.unshift({
        expected: originalWords[i - 1],
        typed: typedWords[j - 1],
        word: typedWords[j - 1],
        type: "spelling",
      });

      i -= 1;
      j -= 1;
    }
  }

  return comparison;
};

const getComparisonWord = (item) => {
  return item.type === "omission"
    ? item.expected
    : item.word || item.typed;
};

const calculateLocalResult = ({
  originalText,
  typedText,
  timeUsedSeconds,
  settings,
}) => {
  const options = {
    ignoreCase:
      settings.ignoreCase ||
      settings.caps === "none",

    ignorePunctuation:
      settings.ignorePunctuation ||
      settings.punctuation === "none",
  };

  const {
    mode,
    originalUnits,
    typedUnits,
  } = getUnits(
    originalText,
    typedText,
    options
  );

  const comparison =
    mode === "characters"
      ? buildLinearComparison(
          originalUnits,
          typedUnits
        )
      : buildWordComparison(
          originalUnits,
          typedUnits
        );

  const correctWords = comparison.filter(
    (item) => item.type === "correct"
  ).length;

  const omissions = comparison.filter(
    (item) => item.type === "omission"
  ).length;

  const additions = comparison.filter(
    (item) => item.type === "addition"
  ).length;

  const spelling = comparison.filter(
    (item) => item.type === "spelling"
  ).length;

  const errors =
    omissions + additions + spelling;

  const minutes =
    Math.max(
      1,
      Number(timeUsedSeconds) || 1
    ) / 60;

  const typedCharacters =
    clean(typedText, options).length;

  const expectedCharacters =
    clean(originalText, options).length;

  const correctCharacters = comparison
    .filter(
      (item) => item.type === "correct"
    )
    .reduce(
      (total, item) =>
        total +
        String(
          item.typed ||
            item.word ||
            ""
        ).length,
      0
    );

  const totalWords =
    originalUnits.length || 1;

  return {
    grossWPM: round(
      (typedCharacters / 5) / minutes
    ),

    netWPM: round(
      (correctCharacters / 5) / minutes
    ),

    accuracy: round(
      Math.max(
        0,
        ((totalWords - errors) /
          totalWords) *
          100
      )
    ),

    totalWords: originalUnits.length,

    typedWords: typedUnits.length,

    correctWords,

    errors,

    errorsDetails: errors,

    typedCharacters,

    expectedCharacters,

    correctCharacters,

    omissions,

    additions,

    spelling,

    capitalization: 0,

    comparison,

    comparisonMode: mode,

    timeTaken: Math.max(
      1,
      Number(timeUsedSeconds) || 1
    ),
  };
};

const getReliableUserToken = () => {
  const token = getUserAuthToken();

  if (token) {
    return token;
  }

  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (
      user?.id ||
      user?._id ||
      user?.email
    ) {
      return (
        localStorage.getItem(
          "userToken"
        ) ||
        localStorage.getItem("token") ||
        ""
      );
    }
  } catch {
    return (
      localStorage.getItem(
        "userToken"
      ) || ""
    );
  }

  return "";
};

function Result() {
  const navigate = useNavigate();

  const resultRef = useRef();

  const { setExamMode } = useExam();

  const [data, setData] = useState(null);

  const [saveError, setSaveError] =
    useState("");

  const settings = useMemo(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "testSettings"
          )
        ) || {}
      );
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    setExamMode(false);
  }, [setExamMode]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const testId =
        localStorage.getItem("testId");

      const typedText =
        localStorage.getItem(
          "typedText"
        ) || "";

      const timeUsedSeconds =
        Number(
          localStorage.getItem(
            "timeUsed"
          )
        ) || 1;

      const backspaces =
        Number(
          localStorage.getItem(
            "backspace"
          )
        ) || 0;

      const keystrokes =
        Number(
          localStorage.getItem(
            "keystrokes"
          )
        ) || typedText.length;

      let originalText = typedText;

      try {
        if (testId) {
          const testRes =
            await API.get(
              `/tests/${testId}`
            );

          originalText =
            testRes.data?.passage ||
            typedText;
        }
      } catch (loadError) {
        console.error(
          "Result test load error:",
          loadError
        );
      }

      const localResult = {
        ...calculateLocalResult({
          originalText,
          typedText,
          timeUsedSeconds,
          settings,
        }),

        backspaces,

        keystrokes,

        saved: false,
      };

      try {
        const token =
          getReliableUserToken();

        if (!token) {
          throw new Error(
            "Login session expired."
          );
        }

        const res = await API.post(
          "/results/compact",
          {
            testId,
            timeTaken:
              timeUsedSeconds,
            resultData: localResult,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setData({
            ...localResult,
            _id: res.data?._id,
            saved: true,
          });

          setSaveError("");
        }
      } catch (saveFailure) {
        const reason =
          saveFailure.response?.data
            ?.detail ||
          saveFailure.response?.data
            ?.message ||
          saveFailure.message;

        console.error(
          "Compact result save error:",
          saveFailure
        );

        if (!cancelled) {
          setData(localResult);

          setSaveError(
            `Result calculated, but DB save failed. Reason: ${reason}`
          );
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [settings]);

  const downloadResult = () => {
    if (!data) return;

    const lines = [
      "SAS Academy Result",

      `Status: ${
        data.saved
          ? "Saved"
          : "Not saved"
      }`,

      `Net WPM: ${
        data.netWPM || 0
      }`,

      `Gross WPM: ${
        data.grossWPM || 0
      }`,

      `Accuracy: ${
        data.accuracy || 0
      }%`,

      `Correct: ${
        data.correctWords || 0
      }/${
        data.totalWords || 0
      }`,

      `Errors: ${
        data.errorsDetails ??
        data.errors ??
        0
      }`,

      `Time: ${
        data.timeTaken || 0
      }s`,
    ];

    const blob = new Blob(
      [lines.join("\n")],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "sas-academy-result.txt";

    link.click();

    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-300" />
      </div>
    );
  }

  const errors =
    data.errorsDetails ??
    data.errors ??
    0;

  const typedCharacters =
    data.typedCharacters ??
    data.keystrokes ??
    0;

  const saveTone = data.saved
    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
    : "border-amber-400/30 bg-amber-400/10 text-amber-100";

  const scoreCards = [
    {
      label: "Net WPM",
      value: formatNumber(
        data.netWPM
      ),
      detail: "Correct strokes",
      icon: Gauge,
      tone: "text-emerald-300",
    },

    {
      label: "Accuracy",
      value: `${formatNumber(
        data.accuracy
      )}%`,
      detail: `${
        data.correctWords || 0
      }/${
        data.totalWords || 0
      } correct`,
      icon: Target,
      tone: "text-amber-200",
    },

    {
      label: "Gross WPM",
      value: formatNumber(
        data.grossWPM
      ),
      detail: "All typed strokes",
      icon: Keyboard,
      tone: "text-sky-300",
    },

    {
      label: "Time",
      value: formatTime(
        data.timeTaken
      ),
      detail: `${
        data.timeTaken || 0
      } seconds`,
      icon: Timer,
      tone: "text-violet-200",
    },
  ];

  const detailStats = [
    {
      label: "Correct",
      value:
        data.correctWords || 0,
      icon: CheckCircle2,
      tone: "text-emerald-300",
    },

    {
      label: "Errors",
      value: errors,
      icon: XCircle,
      tone: "text-red-300",
    },

    {
      label: "Omissions",
      value:
        data.omissions || 0,
      icon: MinusCircle,
      tone: "text-sky-300",
    },

    {
      label: "Additions",
      value:
        data.additions || 0,
      icon: PlusCircle,
      tone: "text-amber-200",
    },
  ];

  const getWordStyle = (type) => {
    const styles = {
      correct:
        "rounded px-[2px] text-emerald-300",

      omission:
        "rounded bg-sky-500/15 px-[3px] text-sky-200 line-through decoration-sky-200/80",

      addition:
        "rounded bg-amber-400/15 px-[3px] text-amber-100 underline decoration-amber-200/80 underline-offset-2",

      spelling:
        "rounded bg-red-500/15 px-[3px] text-red-200 underline decoration-red-200/80 decoration-wavy underline-offset-2",
    };

    return `font-medium ${
      styles[type] ||
      styles.spelling
    }`;
  };

  return (
    <div className="min-h-dvh bg-[#020617] text-white">
      <div
        ref={resultRef}
        className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8"
      >
        <header className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Typing Result
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Performance scorecard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Review speed, accuracy, mistakes, and the word comparison for this attempt.
              </p>

              <div
                className={`mt-4 inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-2 text-sm ${saveTone}`}
              >
                {data.saved ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="shrink-0" />
                )}
                <span className="min-w-0 break-words">
                  {data.saved
                    ? "Result saved to database"
                    : saveError || "Result calculated locally"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-500"
              >
                <BarChart3 size={16} />
                Dashboard
              </button>
              <button
                onClick={() => navigate(`/typing/${localStorage.getItem("testId")}`)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold transition hover:bg-emerald-500"
              >
                <RefreshCcw size={16} />
                Retry
              </button>
              <button
                onClick={downloadResult}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {scoreCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {item.label}
                  </p>
                  <Icon size={18} className={item.tone} />
                </div>
                <p className={`mt-4 text-4xl font-bold ${item.tone}`}>
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.8fr_1.4fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
            <h2 className="text-lg font-semibold">Scoring details</h2>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {detailStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-md border border-white/10 bg-slate-950/70 p-3"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Icon size={15} className={item.tone} />
                      {item.label}
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-md border border-white/10 bg-slate-950/70 p-3 text-sm leading-6 text-slate-300">
              <p>
                Typed strokes:{" "}
                <span className="font-semibold text-white">{typedCharacters}</span>
              </p>
              <p>
                Correct strokes:{" "}
                <span className="font-semibold text-white">
                  {data.correctCharacters || 0}
                </span>
              </p>
              <p>
                Expected strokes:{" "}
                <span className="font-semibold text-white">
                  {data.expectedCharacters || 0}
                </span>
              </p>
              <p>
                Comparison mode:{" "}
                <span className="font-semibold capitalize text-white">
                  {data.comparisonMode || "words"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">Word comparison</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Correct
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-300" />
                  Mistake
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                  Omission
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  Addition
                </span>
              </div>
            </div>

            <div className="mt-4 max-h-[460px] overflow-y-auto rounded-md border border-white/10 bg-slate-950/70 p-4">
              {data.comparison?.length ? (
                <div
                  className={`flex flex-wrap items-start gap-x-1 gap-y-2 text-slate-200 ${
                    data.comparisonMode ===
                    "characters"
                      ? "font-mono text-[15px] leading-7 break-all"
                      : "text-base leading-9"
                  }`}
                >
                  {data.comparison.map(
                    (item, index) => (
                      <span
                        key={index}
                        className={getWordStyle(
                          item.type
                        )}
                        title={
                          item.expected &&
                          item.typed
                            ? `${item.expected} → ${item.typed}`
                            : item.type ===
                              "addition"
                            ? "Extra typed item"
                            : item.type ===
                              "omission"
                            ? "Missed item"
                            : undefined
                        }
                      >
                        {getComparisonWord(
                          item
                        )}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No comparison data
                  available.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Result;
