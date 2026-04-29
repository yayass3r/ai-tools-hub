'use client';

import { useState, useEffect, useCallback } from 'react';

const FREE_DAILY_LIMIT = 5;

export function useUsage(tool: string) {
  const [remaining, setRemaining] = useState<number>(FREE_DAILY_LIMIT);
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch(`/api/usage?tool=${tool}`);
      if (res.ok) {
        const data = await res.json();
        setRemaining(data.remaining);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [tool]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const incrementUsage = useCallback(async (): Promise<boolean> => {
    if (remaining <= 0) return false;
    try {
      const res = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool }),
      });
      if (res.ok) {
        const data = await res.json();
        setRemaining(data.remaining);
        return data.count <= data.limit;
      }
      return false;
    } catch {
      return false;
    }
  }, [remaining, tool]);

  return { remaining, loading, incrementUsage, FREE_DAILY_LIMIT };
}
