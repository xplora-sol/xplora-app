import eventsData from '@/data/events.json';
import { EventData, EventsFile } from '@/types/event';

export const eventsApi = {
  getAllEvents: async (): Promise<EventData[]> => {
    // For now events are static JSON; wrap in promise for future async behavior
    const all = (eventsData as EventsFile).events || [];
    // Treat bannerImage as a URL string and forward it as bannerImageSrc
    return all.map((e) => ({ ...e, bannerImageSrc: e.bannerImage || undefined }));
  },

  getActiveEvents: async (asOf?: Date): Promise<EventData[]> => {
    const now = asOf || new Date();
    const all = (eventsData as EventsFile).events || [];
    return all
      .filter((e) => {
        const start = new Date(e.start);
        const end = new Date(e.end);
        return now >= start && now <= end;
      })
      .map((e) => ({ ...e, bannerImageSrc: e.bannerImage || undefined }));
  },

  getEventById: async (id: string): Promise<EventData | undefined> => {
    const all = (eventsData as EventsFile).events || [];
    const found = all.find((e) => e.id === id);
    if (!found) return undefined;
    return { ...found, bannerImageSrc: found.bannerImage || undefined };
  },
};
