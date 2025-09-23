'use client';

export type AnalyticsPayload = Record<string, unknown>;

export const trackEvent = (event: string, payload: AnalyticsPayload = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  const detail = {
    event,
    payload,
    timestamp: new Date().toISOString()
  };

  window.dispatchEvent(new CustomEvent('mazad-analytics', { detail }));

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, payload);
  }
};
