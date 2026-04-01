import { useCallback, useState } from "react";

const STORAGE_KEY = "ucw_credits";
const DAILY_LIMIT = 10;

interface CreditStore {
  count: number;
  date: string;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadStore(): CreditStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: CreditStore = JSON.parse(raw);
      if (parsed.date === todayStr()) return parsed;
    }
  } catch (_) {}
  return { count: DAILY_LIMIT, date: todayStr() };
}

export function useCredits() {
  const [store, setStore] = useState<CreditStore>(loadStore);

  const spendCredit = useCallback((): boolean => {
    const current = loadStore();
    if (current.count <= 0) return false;
    const next: CreditStore = { count: current.count - 1, date: todayStr() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStore(next);
    return true;
  }, []);

  const resetCredits = useCallback(() => {
    const next: CreditStore = { count: DAILY_LIMIT, date: todayStr() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStore(next);
  }, []);

  // Re-check in case date changed
  const fresh = loadStore();
  const credits = fresh.date !== store.date ? DAILY_LIMIT : store.count;

  return { credits, spendCredit, resetCredits };
}
