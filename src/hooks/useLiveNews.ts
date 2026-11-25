import { useCallback, useEffect, useState } from 'react';

export interface LiveNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  publishedDate: string;
  sortKey: number;
  source: 'ANR' | 'MINAMB';
  sourceLabel: string;
  sourceUrl: string;
}

export interface LiveNewsSourceInfo {
  id: 'ANR' | 'MINAMB';
  label: string;
  url: string;
  ok: boolean;
  count: number;
}

interface LiveNewsState {
  items: LiveNewsItem[];
  sources: LiveNewsSourceInfo[];
  fetchedAt: string | null;
  loading: boolean;
  refreshing: boolean;
  error: boolean;
}

let sharedState: LiveNewsState = {
  items: [],
  sources: [],
  fetchedAt: null,
  loading: true,
  refreshing: false,
  error: false,
};

let lastFetchTs = 0;
let activePromise: Promise<void> | null = null;
const listeners = new Set<(state: LiveNewsState) => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener(sharedState);
  }
}

async function fetchLiveNews(forceRefresh = false): Promise<void> {
  if (activePromise && !forceRefresh) {
    return activePromise;
  }

  sharedState = {
    ...sharedState,
    loading: sharedState.items.length === 0,
    refreshing: sharedState.items.length > 0 || forceRefresh,
    error: false,
  };
  notifyListeners();

  const request = (async () => {
    try {
      const endpoint = forceRefresh ? '/api/live-news?refresh=1' : '/api/live-news';
      const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const items = Array.isArray(data.items) ? (data.items as LiveNewsItem[]) : [];
      const sources = Array.isArray(data.sources) ? (data.sources as LiveNewsSourceInfo[]) : [];
      lastFetchTs = Date.now();
      sharedState = {
        items,
        sources,
        fetchedAt: typeof data.fetchedAt === 'string' ? data.fetchedAt : new Date().toISOString(),
        loading: false,
        refreshing: false,
        error: items.length === 0 && sources.every((s) => !s.ok),
      };
    } catch {
      sharedState = {
        ...sharedState,
        loading: false,
        refreshing: false,
        error: sharedState.items.length === 0,
      };
    } finally {
      activePromise = null;
      notifyListeners();
    }
  })();

  activePromise = request;
  return request;
}

export interface LiveArticleDetail {
  title: string;
  publishedDate: string;
  imageUrl: string;
  paragraphs: string[];
  url: string;
  source: 'MINAMB' | 'ANR';
}

export async function fetchLiveArticle(url: string): Promise<LiveArticleDetail> {
  const res = await fetch(`/api/live-news/article?url=${encodeURIComponent(url)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export function useLiveNews() {
  const [state, setState] = useState<LiveNewsState>(sharedState);

  useEffect(() => {
    listeners.add(setState);
    setState(sharedState);

    const isStale = Date.now() - lastFetchTs > 120_000;
    if ((sharedState.items.length === 0 || isStale) && !activePromise) {
      void fetchLiveNews(false);
    }

    const interval = window.setInterval(() => {
      void fetchLiveNews(false);
    }, 120_000);

    return () => {
      listeners.delete(setState);
      window.clearInterval(interval);
    };
  }, []);

  const refreshNow = useCallback(() => {
    void fetchLiveNews(true);
  }, []);

  return {
    ...state,
    refreshNow,
  };
}

