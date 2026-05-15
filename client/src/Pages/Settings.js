import { useEffect, useState } from "react";
import { Save, Settings as SettingsIcon, SlidersHorizontal, Trash2, Type } from "lucide-react";
import {
  defaultUserSettings,
  getUserSettings,
  saveUserSettings,
  USER_SETTINGS_KEY,
} from "../utils/settingsStorage";

const applyTypingDefaults = (settings) => {
  const typingSettings = {
    version: 2,
    backspace: settings.defaultExamType === "ssc" ? false : settings.defaultBackspace,
    spelling: settings.defaultExamType === "ssc" ? "full" : settings.defaultSpelling,
    caps: settings.defaultCaps,
    punctuation: settings.defaultPunctuation,
    fontSize: settings.defaultFontSize,
    time: settings.defaultTimer,
    examType: settings.defaultExamType,
  };

  localStorage.setItem("testSettings", JSON.stringify(typingSettings));
};

function Settings() {
  const [settings, setSettings] = useState(defaultUserSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSettings(getUserSettings());
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "defaultExamType" && value === "ssc") {
        next.defaultBackspace = false;
        next.defaultSpelling = "full";
        next.defaultTimer = 50;
      }
      return next;
    });
    setMessage("");
  };

  const handleSave = () => {
    const saved = saveUserSettings(settings);
    applyTypingDefaults(saved);
    setSettings(saved);
    setMessage("Settings saved and applied to typing defaults.");
  };

  const handleReset = () => {
    localStorage.removeItem(USER_SETTINGS_KEY);
    localStorage.removeItem("testSettings");
    setSettings(defaultUserSettings);
    setMessage("Settings reset to defaults.");
  };

  const clearPracticeData = () => {
    ["typedText", "testId", "time", "backspace", "timeUsed", "keystrokes"].forEach((key) => localStorage.removeItem(key));
    setMessage("Saved practice session data cleared.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 text-white">
      <header className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
            <SettingsIcon size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your typing defaults and local practice preferences.</p>
          </div>
        </div>
      </header>

      {message && (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
          {message}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Type size={18} className="text-emerald-300" />
            Typing Defaults
          </h2>

          <div className="mt-5 space-y-4">
            <SelectField
              label="Default exam type"
              value={settings.defaultExamType}
              onChange={(value) => updateSetting("defaultExamType", value)}
              options={[
                { value: "custom", label: "Custom" },
                { value: "ssc", label: "SSC" },
              ]}
            />

            <NumberField
              label="Default timer"
              value={settings.defaultTimer}
              min={1}
              max={60}
              suffix="min"
              onChange={(value) => updateSetting("defaultTimer", value)}
            />

            <NumberField
              label="Default font size"
              value={settings.defaultFontSize}
              min={16}
              max={34}
              suffix="px"
              onChange={(value) => updateSetting("defaultFontSize", value)}
            />

            <ToggleField
              label="Allow backspace by default"
              checked={settings.defaultExamType !== "ssc" && settings.defaultBackspace}
              disabled={settings.defaultExamType === "ssc"}
              onChange={(checked) => updateSetting("defaultBackspace", checked)}
            />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <SlidersHorizontal size={18} className="text-sky-300" />
            Review Rules
          </h2>

          <div className="mt-5 space-y-4">
            <SelectField
              label="Spelling mistake penalty"
              value={settings.defaultSpelling}
              onChange={(value) => updateSetting("defaultSpelling", value)}
              options={[
                { value: "half", label: "Half" },
                { value: "full", label: "Full" },
              ]}
            />

            <SelectField
              label="Capitalization"
              value={settings.defaultCaps}
              onChange={(value) => updateSetting("defaultCaps", value)}
              options={[
                { value: "none", label: "Ignore" },
                { value: "full", label: "Count" },
              ]}
            />

            <SelectField
              label="Punctuation"
              value={settings.defaultPunctuation}
              onChange={(value) => updateSetting("defaultPunctuation", value)}
              options={[
                { value: "none", label: "Ignore" },
                { value: "full", label: "Count" },
              ]}
            />

            <ToggleField
              label="Show practice tips"
              checked={settings.showPracticeTips}
              onChange={(checked) => updateSetting("showPracticeTips", checked)}
            />
            <ToggleField
              label="Compact lists"
              checked={settings.compactLists}
              onChange={(checked) => updateSetting("compactLists", checked)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Local Data</h2>
            <p className="mt-1 text-sm text-slate-400">Clear saved in-progress typing result data from this browser.</p>
          </div>
          <button
            onClick={clearPracticeData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/10"
          >
            <Trash2 size={16} />
            Clear Practice Data
          </button>
        </div>
      </section>

      <div className="sticky bottom-3 rounded-lg border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleReset}
            className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <Save size={17} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-white outline-none focus:border-emerald-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ label, value, min, max, suffix, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value) || min)))}
          className="w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-white outline-none focus:border-emerald-300"
        />
        <span className="w-10 text-sm text-slate-400">{suffix}</span>
      </div>
    </label>
  );
}

function ToggleField({ label, checked, disabled, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-400 disabled:opacity-50"
      />
    </label>
  );
}

export default Settings;
