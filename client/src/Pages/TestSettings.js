import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CaseSensitive,
    Check,
    Clock3,
    Eraser,
    FileCheck2,
    Keyboard,
    RotateCcw,
    Shield,
    SlidersHorizontal,
    SpellCheck,
    Type
} from "lucide-react";

const SETTINGS_VERSION = 2;

const defaultSettings = {
    backspace: true,
    spelling: "half",
    caps: "none",
    punctuation: "none",
    fontSize: 20,
    time: 50,
    examType: "custom",
    version: SETTINGS_VERSION
};

const presets = [
    {
        id: "practice",
        title: "Practice",
        detail: "50-minute daily typing drill with forgiving review",
        values: { backspace: true, spelling: "half", caps: "none", punctuation: "none", fontSize: 20, time: 50, examType: "custom", version: SETTINGS_VERSION }
    },
    {
        id: "ssc",
        title: "SSC Mode",
        detail: "50-minute SSC setup with backspace blocked",
        values: { backspace: false, spelling: "full", caps: "none", punctuation: "none", fontSize: 20, time: 50, examType: "ssc", version: SETTINGS_VERSION }
    },
    {
        id: "strict",
        title: "Strict Review",
        detail: "Case and punctuation both count",
        values: { backspace: true, spelling: "full", caps: "full", punctuation: "full", fontSize: 22, time: 50, examType: "custom", version: SETTINGS_VERSION }
    }
];

const quickTimers = [10, 15, 30, 50, 60];

function TestSettings() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [settings, setSettings] = useState(() => {
        try {
            const savedSettings = JSON.parse(localStorage.getItem("testSettings")) || {};
            if (savedSettings.version !== SETTINGS_VERSION) {
                return defaultSettings;
            }

            return { ...defaultSettings, ...savedSettings };
        } catch {
            return defaultSettings;
        }
    });

    const updateSetting = (key, value) => {
        setSettings((prev) => {
            const next = { ...prev, [key]: value };

            if (key === "examType" && value === "ssc") {
                next.backspace = false;
                next.spelling = "full";
                next.time = 50;
            }

            if (key === "backspace" && prev.examType === "ssc") {
                next.backspace = false;
            }

            return next;
        });
    };

    const applyPreset = (preset) => {
        setSettings(preset.values);
    };

    const handleStart = () => {
        const finalSettings = {
            ...settings,
            version: SETTINGS_VERSION,
            time: Math.max(1, Math.min(60, Number(settings.time) || defaultSettings.time)),
            fontSize: Math.max(16, Math.min(34, Number(settings.fontSize) || defaultSettings.fontSize))
        };

        localStorage.setItem("testSettings", JSON.stringify(finalSettings));
        navigate(`/typing/${id}`);
    };

    const activePreset = useMemo(() => {
        return presets.find((preset) => Object.keys(preset.values).every((key) => preset.values[key] === settings[key]))?.id;
    }, [settings]);

    const scoringRules = [
        { label: "Backspace", value: settings.examType === "ssc" || !settings.backspace ? "Blocked" : "Allowed", icon: Eraser },
        { label: "Mistake penalty", value: settings.spelling === "full" ? "Full" : "Half", icon: SpellCheck },
        { label: "Capitalization", value: settings.caps === "full" ? "Counted" : "Ignored", icon: CaseSensitive },
        { label: "Punctuation", value: settings.punctuation === "full" ? "Counted" : "Ignored", icon: FileCheck2 }
    ];

    return (
        <div className="text-white">
            <div className="mx-auto max-w-6xl space-y-5">
                <header className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Typing setup</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Configure your test</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                Choose rules before the timer starts. These settings are saved locally and used by typing, scoring, and result validation.
                            </p>
                        </div>

                        <button
                            onClick={handleStart}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Start Test <ArrowRight size={18} />
                        </button>
                    </div>
                </header>

                <section className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl"
                    >
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-emerald-300" />
                            <h2 className="text-lg font-semibold">Presets</h2>
                        </div>

                        <div className="mt-4 space-y-3">
                            {presets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => applyPreset(preset)}
                                    className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition ${
                                        activePreset === preset.id
                                            ? "border-emerald-400/50 bg-emerald-400/10"
                                            : "border-white/10 bg-slate-950/35 hover:bg-white/[0.06]"
                                    }`}
                                >
                                    <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                                        activePreset === preset.id ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-slate-600 text-transparent"
                                    }`}>
                                        <Check size={13} />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-white">{preset.title}</span>
                                        <span className="mt-1 block text-xs leading-5 text-slate-400">{preset.detail}</span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setSettings(defaultSettings)}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                        >
                            <RotateCcw size={16} /> Reset Defaults
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl"
                    >
                        <div className="flex items-center gap-2">
                            <Shield size={18} className="text-sky-300" />
                            <h2 className="text-lg font-semibold">Exam Rules</h2>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Exam type</label>
                                <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-950/60 p-1">
                                    {[
                                        { value: "custom", label: "Custom" },
                                        { value: "ssc", label: "SSC" }
                                    ].map((item) => (
                                        <button
                                            key={item.value}
                                            onClick={() => updateSetting("examType", item.value)}
                                            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                                                settings.examType === item.value ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Backspace</label>
                                <button
                                    onClick={() => updateSetting("backspace", !settings.backspace)}
                                    disabled={settings.examType === "ssc"}
                                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
                                        settings.examType !== "ssc" && settings.backspace
                                            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                                            : "border-red-400/30 bg-red-400/10 text-red-200"
                                    }`}
                                >
                                    <span className="flex items-center gap-2"><Keyboard size={16} /> {settings.examType === "ssc" || !settings.backspace ? "Blocked" : "Allowed"}</span>
                                    <span className="text-xs text-slate-400">{settings.examType === "ssc" ? "Locked" : "Toggle"}</span>
                                </button>
                            </div>

                            <SegmentedControl
                                label="Spelling mistakes"
                                value={settings.spelling}
                                onChange={(value) => updateSetting("spelling", value)}
                                options={[
                                    { value: "half", label: "Half" },
                                    { value: "full", label: "Full" }
                                ]}
                            />

                            <SegmentedControl
                                label="Capitalization"
                                value={settings.caps}
                                onChange={(value) => updateSetting("caps", value)}
                                options={[
                                    { value: "none", label: "Ignore" },
                                    { value: "full", label: "Count" }
                                ]}
                            />

                            <SegmentedControl
                                label="Punctuation"
                                value={settings.punctuation}
                                onChange={(value) => updateSetting("punctuation", value)}
                                options={[
                                    { value: "none", label: "Ignore" },
                                    { value: "full", label: "Count" }
                                ]}
                            />
                        </div>
                    </motion.div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
                        <div className="flex items-center gap-2">
                            <Clock3 size={18} className="text-amber-200" />
                            <h2 className="text-lg font-semibold">Timing and Reading</h2>
                        </div>

                        <div className="mt-5 space-y-6">
                            <RangeControl
                                label="Timer"
                                value={settings.time}
                                min={1}
                                max={60}
                                suffix="min"
                                onChange={(value) => updateSetting("time", value)}
                            />

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-300">Quick timer</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {quickTimers.map((minutes) => (
                                        <button
                                            key={minutes}
                                            onClick={() => updateSetting("time", minutes)}
                                            className={`rounded-md border px-2 py-2 text-sm font-semibold transition ${
                                                Number(settings.time) === minutes
                                                    ? "border-emerald-300 bg-emerald-300 text-slate-950"
                                                    : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10"
                                            }`}
                                        >
                                            {minutes}m
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <RangeControl
                                label="Typing font size"
                                value={settings.fontSize}
                                min={16}
                                max={34}
                                suffix="px"
                                onChange={(value) => updateSetting("fontSize", value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl">
                        <div className="flex items-center gap-2">
                            <Type size={18} className="text-violet-200" />
                            <h2 className="text-lg font-semibold">Live Preview</h2>
                        </div>

                        <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Typing area sample</p>
                            <p
                                className="mt-3 leading-relaxed text-slate-100"
                                style={{ fontSize: `${settings.fontSize}px` }}
                            >
                                The quick brown fox typed a clean sentence for practice.
                            </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {scoringRules.map((rule) => {
                                const Icon = rule.icon;
                                return (
                                    <div key={rule.label} className="rounded-md bg-slate-950/60 p-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Icon size={14} />
                                            {rule.label}
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-white">{rule.value}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="sticky bottom-3 z-10 rounded-lg border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-300">
                            Ready for a <span className="font-semibold text-white">{settings.time} minute</span> {settings.examType === "ssc" ? "SSC" : "custom"} typing test.
                        </p>
                        <button
                            onClick={handleStart}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Start Test <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SegmentedControl({ label, value, onChange, options }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
            <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-950/60 p-1">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                            value === option.value ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function RangeControl({ label, value, min, max, suffix, onChange }) {
    const normalized = Number(value) || min;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-slate-300">{label}</label>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onChange(Math.max(min, normalized - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-lg leading-none hover:bg-white/10"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={normalized}
                        onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value) || min)))}
                        className="h-8 w-16 rounded-md border border-white/10 bg-slate-950 px-2 text-center text-sm font-semibold text-white outline-none focus:border-emerald-300"
                    />
                    <button
                        onClick={() => onChange(Math.min(max, normalized + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-lg leading-none hover:bg-white/10"
                    >
                        +
                    </button>
                    <span className="w-8 text-sm text-slate-400">{suffix}</span>
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={normalized}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full accent-emerald-400"
            />
        </div>
    );
}

export default TestSettings;
