import mixpanel, { Dict } from 'mixpanel-browser';

if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
}

export type EventType = 'Page view' | 'Faq viewed';

export const trackEvent = (event: EventType, data: Dict | undefined) => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track(event, data);
  }
};
