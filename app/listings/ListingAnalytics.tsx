'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/app/lib/analytics';

type ListingAnalyticsProps = {
  event: string;
  payload: Record<string, unknown>;
};

const ListingAnalytics = ({ event, payload }: ListingAnalyticsProps) => {
  useEffect(() => {
    trackEvent(event, payload);
  }, [event, payload]);

  return null;
};

export default ListingAnalytics;
