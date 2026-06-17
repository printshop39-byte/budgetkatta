'use client';
// useRemoteData — fetch product data from an API route with a loading state for
// skeletons, the data source (demo vs mongodb) for the badge, and a fetch
// timestamp for "last updated". On error it falls back to the passed demo data.

import { useEffect, useState } from 'react';

export type DataSource = 'demo' | 'mongodb' | null;

export interface RemoteData<T> {
  data: T[];
  loading: boolean;
  source: DataSource;
  updatedAt: Date | null;
}

export function useRemoteData<T>(url: string, fallback: T[]): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({
    data: fallback,
    loading: true,
    source: null,
    updatedAt: null,
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true }));

    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (!active) return;
        if (j?.ok && Array.isArray(j.data) && j.data.length) {
          setState({ data: j.data, loading: false, source: j.source ?? 'demo', updatedAt: new Date() });
        } else {
          setState({ data: fallback, loading: false, source: 'demo', updatedAt: new Date() });
        }
      })
      .catch(() => {
        if (active) setState({ data: fallback, loading: false, source: 'demo', updatedAt: new Date() });
      });

    return () => {
      active = false;
    };
  }, [url]);

  return state;
}
