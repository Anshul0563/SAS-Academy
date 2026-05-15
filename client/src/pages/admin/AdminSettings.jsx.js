import React, { useState, useEffect } from 'react';
import { Settings, Save, Database, Globe } from 'lucide-react';

import { motion } from 'framer-motion';

const STORAGE_KEY = 'sasAdminSettings';
const defaultSettings = {
  siteName: 'SAS Academy',
  emailNotifications: true,
  allowRegistrations: true,
  maintenanceMode: false,
  testDurationLimit: 60,
  defaultDifficulty: 'medium'
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setSettings({ ...defaultSettings, ...saved });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const normalizedSettings = {
        ...settings,
        testDurationLimit: Math.max(1, Math.min(60, Number(settings.testDurationLimit) || 60))
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedSettings));
      setSettings(normalizedSettings);
      setMessage('✅ Settings saved locally!');
    } catch (error) {
      setMessage('❌ Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent sm:text-3xl">
            ⚙️ Admin Settings
          </h1>
          <p className="text-slate-400">Configure academy settings</p>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-sm font-medium ${
            message.includes('✅') 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
        {/* General Settings */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-xl sm:p-6 lg:p-8"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Site Name
              </label>
              <input
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <input
                  type="checkbox"
                  name="allowRegistrations"
                  checked={settings.allowRegistrations}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                />
                Allow New Registrations
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                />
                Email Notifications
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 bg-slate-800 border-slate-700 rounded focus:ring-orange-500"
                />
                Maintenance Mode
              </label>
            </div>
          </div>
        </motion.div>

        {/* Test Settings */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-xl sm:p-6 lg:p-8"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Test Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Test Duration (minutes)
              </label>
              <input
                name="testDurationLimit"
                type="number"
                value={settings.testDurationLimit}
                onChange={handleChange}
                min={5}
                max={60}
                className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Default Difficulty
              </label>
              <select
                name="defaultDifficulty"
                value={settings.defaultDifficulty || 'medium'}
                onChange={handleChange}
                className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-5 h-5 inline mr-2" />
              Save All Settings
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
