import { eventsApi } from '@/api/events';
import { EventData } from '@/types/event';
import { useQuery } from '@tanstack/react-query';

export function useEvents() {
  const { data: events, isLoading } = useQuery<EventData[]>({
    queryKey: ['events'],
    queryFn: async () => {
      return await eventsApi.getAllEvents();
    },
  });

  const { data: activeEvents } = useQuery<EventData[]>({
    queryKey: ['events', 'active'],
    queryFn: async () => {
      return await eventsApi.getActiveEvents();
    },
  });

  return {
    events: events || [],
    activeEvents: activeEvents || [],
    isLoading,
  };
}
