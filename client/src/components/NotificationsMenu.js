import { useEffect, useRef, useState } from "react";
import { Bell, Megaphone, X } from "lucide-react";

import API from "../api/axios";

const readStoredIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

function NotificationsMenu({
  storageKey = "sasReadNotifications",
  clearable = false,
}) {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [readNotificationIds, setReadNotificationIds] = useState(() =>
    readStoredIds(storageKey),
  );
  const dismissKey = `${storageKey}:dismissed`;
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState(() =>
    readStoredIds(dismissKey),
  );
  const menuRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const fetchAnnouncement = async () => {
      try {
        const res = await API.get("/announcements/active", {
          params: { t: Date.now() },
        });

        if (mounted) {
          setAnnouncement(res.data?.announcement || null);
        }
      } catch (error) {
        console.error("Notification fetch error:", error.message);
      }
    };

    fetchAnnouncement();
    const interval = setInterval(fetchAnnouncement, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificationId = announcement
    ? `${announcement._id || "announcement"}:${announcement.updatedAt || ""}`
    : "";
  const hasUnread = Boolean(
    notificationId && !readNotificationIds.includes(notificationId),
  );
  const visibleAnnouncement = Boolean(
    announcement && !dismissedNotificationIds.includes(notificationId),
  );

  const markRead = () => {
    if (!notificationId) return;

    const nextIds = Array.from(new Set([...readNotificationIds, notificationId]));
    setReadNotificationIds(nextIds);
    localStorage.setItem(storageKey, JSON.stringify(nextIds));
  };

  const clearNotification = () => {
    if (!notificationId) return;

    const nextDismissedIds = Array.from(
      new Set([...dismissedNotificationIds, notificationId]),
    );
    setDismissedNotificationIds(nextDismissedIds);
    localStorage.setItem(dismissKey, JSON.stringify(nextDismissedIds));
    markRead();
    setAnnouncement(null);
  };

  const handleToggle = () => {
    setOpen((value) => !value);
    if (hasUnread) markRead();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1]"
      >
        <Bell size={18} />
        {hasUnread && (
          <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(88vw,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
            {visibleAnnouncement && (
              <div className="flex items-center gap-1">
                {clearable && (
                  <button
                    type="button"
                    onClick={clearNotification}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-500/10 hover:text-red-200"
                    aria-label="Clear notification"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {visibleAnnouncement ? (
            <div className="p-3">
              <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-cyan-100">
                  <Megaphone size={16} />
                  <span className="text-sm font-semibold">Announcement</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {announcement.text}
                </p>
                {announcement.updatedAt && (
                  <p className="mt-3 text-xs text-slate-500">
                    Updated {new Date(announcement.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No notifications right now.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsMenu;
