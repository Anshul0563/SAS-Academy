export const USER_SETTINGS_KEY = "sasUserSettings";
export const ADMIN_SETTINGS_KEY = "sasAdminSettings";

export const defaultUserSettings = {
  defaultExamType: "custom",
  defaultTimer: 50,
  defaultFontSize: 20,
  defaultBackspace: true,
  defaultSpelling: "half",
  defaultCaps: "none",
  defaultPunctuation: "none",
  compactLists: false,
  showPracticeTips: true,
};

export const defaultAdminSettings = {
  siteName: "SAS Academy",
  announcementEnabled: false,
  announcementText: "",
  emailNotifications: true,
  allowRegistrations: true,
  maintenanceMode: false,
  transcriptionDuration: 50,
  dictationDuration: 10,
  maxTestDuration: 60,
  defaultDifficulty: "medium",
  passingAccuracy: 80,
  dashboardRefreshSeconds: 30,
};

const readJson = (key, fallback) => {
  try {
    return { ...fallback, ...(JSON.parse(localStorage.getItem(key) || "{}") || {}) };
  } catch {
    return fallback;
  }
};

export const getUserSettings = () => readJson(USER_SETTINGS_KEY, defaultUserSettings);

export const saveUserSettings = (settings) => {
  const normalized = {
    ...defaultUserSettings,
    ...settings,
    defaultTimer: Math.max(1, Math.min(60, Number(settings.defaultTimer) || defaultUserSettings.defaultTimer)),
    defaultFontSize: Math.max(16, Math.min(34, Number(settings.defaultFontSize) || defaultUserSettings.defaultFontSize)),
  };

  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(normalized));
  return normalized;
};

export const getAdminSettings = () => readJson(ADMIN_SETTINGS_KEY, defaultAdminSettings);

export const saveAdminSettings = (settings) => {
  const normalized = {
    ...defaultAdminSettings,
    ...settings,
    transcriptionDuration: Math.max(1, Math.min(60, Number(settings.transcriptionDuration) || defaultAdminSettings.transcriptionDuration)),
    dictationDuration: Math.max(1, Math.min(60, Number(settings.dictationDuration) || defaultAdminSettings.dictationDuration)),
    maxTestDuration: Math.max(1, Math.min(60, Number(settings.maxTestDuration) || defaultAdminSettings.maxTestDuration)),
    passingAccuracy: Math.max(1, Math.min(100, Number(settings.passingAccuracy) || defaultAdminSettings.passingAccuracy)),
    dashboardRefreshSeconds: Math.max(10, Math.min(300, Number(settings.dashboardRefreshSeconds) || defaultAdminSettings.dashboardRefreshSeconds)),
  };

  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(normalized));
  return normalized;
};
