import React, { useEffect, useState } from 'react';
import { Bell, Database, Download, Globe, Loader2, RotateCcw, Save, Send, Settings, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  defaultAdminSettings,
  getAdminSettings,
  saveAdminSettings,
  ADMIN_SETTINGS_KEY,
} from '../../utils/settingsStorage';
import API from '../../api/axios';
import { getAdminAuthToken } from '../../utils/authStorage';

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultAdminSettings);
  const [loading, setLoading] = useState(false);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      const localSettings = getAdminSettings();
      setSettings(localSettings);

      try {
        const token = getAdminAuthToken();
        if (!token) return;

        const res = await API.get('/announcements', {
          headers: { Authorization: `Bearer ${token}` },
          params: { t: Date.now() },
        });
        const announcement = res.data?.announcement;

        if (mounted && announcement) {
          setSettings((prev) => ({
            ...prev,
            announcementEnabled: Boolean(announcement.enabled),
            announcementText: announcement.text || '',
          }));
        }
      } catch (error) {
        console.error('Announcement settings load error:', error.message);
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setMessage('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const saved = saveAdminSettings(settings);
      let finalSettings = saved;

      const token = getAdminAuthToken();
      if (token) {
        const res = await API.put(
          '/announcements',
          {
            enabled: saved.announcementEnabled,
            text: saved.announcementText,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        finalSettings = {
          ...saved,
          announcementEnabled: Boolean(res.data?.announcement?.enabled),
          announcementText: res.data?.announcement?.text || '',
        };
      }

      setSettings(finalSettings);
      saveAdminSettings(finalSettings);
      setMessage('Settings saved. Announcement and notifications updated.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving settings.');
    } finally {
      setLoading(false);
    }
  };

  const publishAnnouncement = async () => {
    setAnnouncementLoading(true);
    setMessage('');

    try {
      const text = String(settings.announcementText || '').trim();
      if (!text) {
        setMessage('Announcement text is required.');
        return;
      }

      const token = getAdminAuthToken();
      if (!token) {
        setMessage('Admin session expired. Please login again.');
        return;
      }

      const res = await API.put(
        '/announcements',
        {
          enabled: true,
          text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nextSettings = saveAdminSettings({
        ...settings,
        announcementEnabled: true,
        announcementText: res.data?.announcement?.text || text,
      });

      setSettings(nextSettings);
      setMessage('Announcement published. Students will see it in notifications.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error publishing announcement.');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const resetSettings = () => {
    localStorage.removeItem(ADMIN_SETTINGS_KEY);
    setSettings(defaultAdminSettings);
    setMessage('Admin settings reset to defaults.');
  };

  const exportSettings = () => {
    const payload = JSON.stringify(settings, null, 2);
    navigator.clipboard?.writeText(payload);
    setMessage('Settings JSON copied to clipboard.');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Settings</h1>
            <p className="text-slate-400">Control local admin defaults for test creation and dashboard behavior.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={exportSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            <Download size={16} />
            Copy JSON
          </button>
          <button
            onClick={resetSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/10"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300"
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SettingsPanel title="Academy" icon={Globe}>
          <TextField label="Site name" name="siteName" value={settings.siteName} onChange={handleChange} />
          <ToggleField label="Allow new registrations" name="allowRegistrations" checked={settings.allowRegistrations} onChange={handleChange} />
          <ToggleField label="Maintenance mode" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
        </SettingsPanel>

        <SettingsPanel title="Test Defaults" icon={Database}>
          <NumberField label="Transcription duration" name="transcriptionDuration" value={settings.transcriptionDuration} min={1} max={60} suffix="min" onChange={handleChange} />
          <NumberField label="Dictation duration" name="dictationDuration" value={settings.dictationDuration} min={1} max={60} suffix="min" onChange={handleChange} />
          <NumberField label="Max duration" name="maxTestDuration" value={settings.maxTestDuration} min={1} max={60} suffix="min" onChange={handleChange} />
          <SelectField
            label="Default difficulty"
            name="defaultDifficulty"
            value={settings.defaultDifficulty}
            onChange={handleChange}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
        </SettingsPanel>

        <SettingsPanel title="Communication" icon={Bell}>
          <ToggleField label="Email notifications" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} />
          <ToggleField label="Show announcement" name="announcementEnabled" checked={settings.announcementEnabled} onChange={handleChange} />
          <TextAreaField label="Announcement text" name="announcementText" value={settings.announcementText} maxLength={1000} onChange={handleChange} />
          <button
            type="button"
            onClick={publishAnnouncement}
            disabled={announcementLoading || !String(settings.announcementText || '').trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {announcementLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {announcementLoading ? 'Publishing...' : 'Submit Announcement'}
          </button>
        </SettingsPanel>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 shadow-2xl sm:p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          Results and Dashboard
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <NumberField label="Passing accuracy" name="passingAccuracy" value={settings.passingAccuracy} min={1} max={100} suffix="%" onChange={handleChange} />
          <NumberField label="Dashboard refresh" name="dashboardRefreshSeconds" value={settings.dashboardRefreshSeconds} min={10} max={300} suffix="sec" onChange={handleChange} />
        </div>
      </div>

      <div className="sticky bottom-3 z-10 rounded-xl border border-slate-700/60 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50 sm:w-auto"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

function SettingsPanel({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
        <Icon className="w-5 h-5 text-blue-300" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function TextField({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-white outline-none transition focus:border-blue-500"
      />
    </label>
  );
}

function TextAreaField({ label, name, value, maxLength, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <textarea
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-white outline-none transition focus:border-blue-500"
      />
      {maxLength && (
        <span className="mt-1 block text-right text-xs text-slate-500">
          {String(value || '').length}/{maxLength}
        </span>
      )}
    </label>
  );
}

function NumberField({ label, name, value, min, max, suffix, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          name={name}
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-white outline-none transition focus:border-blue-500"
        />
        <span className="w-10 text-sm text-slate-400">{suffix}</span>
      </div>
    </label>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-white outline-none transition focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm text-slate-300">
      <span>{label}</span>
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-blue-500"
      />
    </label>
  );
}

export default AdminSettings;
