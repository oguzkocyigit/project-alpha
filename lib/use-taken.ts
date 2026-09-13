"use client";

import { useCallback, useSyncExternalStore } from "react";

function storageKey(slug: string, dateKey: string) {
  return `protokol:${slug}:${dateKey}`;
}

const EMPTY_SET: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function notifyListeners() {
  for (const listener of listeners) listener();
}

// useSyncExternalStore requires getSnapshot to return a referentially stable
// value when nothing changed — otherwise it re-renders forever. Cache the
// parsed Set per key and only rebuild it when the raw localStorage string
// actually changes.
const snapshotCache = new Map<string, { raw: string | null; set: ReadonlySet<string> }>();

function readTaken(key: string): ReadonlySet<string> {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return EMPTY_SET;
  }

  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) {
    return cached.set;
  }

  let set: ReadonlySet<string>;
  try {
    set = raw ? new Set(JSON.parse(raw)) : EMPTY_SET;
  } catch {
    set = EMPTY_SET;
  }

  snapshotCache.set(key, { raw, set });
  return set;
}

/**
 * Per-viewer "marked as taken" checklist state for a given day, persisted in
 * localStorage only (never sent anywhere) so it's private to this browser
 * and resets naturally as `dateKey` changes day to day.
 *
 * Uses useSyncExternalStore (not useState+useEffect) so the server-rendered
 * "nothing taken yet" snapshot and the client's real localStorage value
 * reconcile without a hydration mismatch.
 */
export function useTakenItems(slug: string, dateKey: string) {
  const key = storageKey(slug, dateKey);

  const taken = useSyncExternalStore(
    subscribe,
    () => readTaken(key),
    () => EMPTY_SET,
  );

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(readTaken(key));
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(key, JSON.stringify([...next]));
      } catch {
        // localStorage unavailable (private mode, blocked storage) — nothing persists this toggle
      }
      notifyListeners();
    },
    [key],
  );

  return { taken, toggle };
}
