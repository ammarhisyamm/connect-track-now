import { useSyncExternalStore } from "react";
import { activities, type Activity, type ActivityStatus } from "./mock-data";

const KEY = "connect-track-activity-v1";

export interface ActivityOverride {
  status?: ActivityStatus;
  checkInTime?: string;
  checkOutTime?: string;
  photoUrl?: string;
}

let cache: Record<string, ActivityOverride> = {};
let hydrated = false;
const listeners = new Set<() => void>();

function readPersisted(): Record<string, ActivityOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* abaikan */
  }
}

function hydrate() {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    cache = { ...readPersisted() };
  }
}

function base(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

// Cache array gabungan agar snapshot stabil antar render
let allCache: Activity[] | null = null;

function allMerged(): Activity[] {
  hydrate();
  if (!allCache) {
    allCache = activities.map((a) => ({ ...a, ...(cache[a.id] ?? {}) }));
  }
  return allCache;
}

function merged(id: string): Activity | undefined {
  return allMerged().find((a) => a.id === id);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function notify() {
  allCache = null;
  listeners.forEach((l) => l());
}

export function updateActivity(id: string, patch: ActivityOverride) {
  hydrate();
  cache[id] = { ...(cache[id] ?? {}), ...patch };
  if (typeof window !== "undefined") persist();
  notify();
}

export function resetActivities() {
  cache = {};
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* abaikan */
    }
  }
  notify();
}

/** Satu aktivitas (data statis + override check-in/out). */
export function useActivity(id: string): Activity | undefined {
  return useSyncExternalStore(subscribe, () => merged(id), () => base(id));
}

/** Semua aktivitas — untuk list/home agar status selalu sinkron. */
export function useActivities(): Activity[] {
  return useSyncExternalStore(subscribe, allMerged, () => activities);
}

export function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
