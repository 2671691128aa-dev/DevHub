import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useHistoryStore } from '@/store/useHistoryStore';
import { tools } from '@/data';

/**
 * Tracks tool usage automatically when navigating to tool pages.
 * Call this hook once in App or Layout component.
 */
export function useTrackRouteChange() {
  const location = useLocation();
  const recordUsage = useHistoryStore((s) => s.recordUsage);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Only record when path actually changes
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    // Find matching tool by route
    const tool = tools.find((t) => t.route === location.pathname);
    if (tool) {
      recordUsage(tool.id);
    }
  }, [location.pathname, recordUsage]);
}
