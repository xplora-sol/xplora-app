export interface EventData {
  id: string;
  title: string;
  description: string;
  start: string; // ISO
  end: string; // ISO
  featuredQuestIds?: string[];
  fomoText?: string;
  bannerColor?: string;
  /** Optional banner image source. Treated as a URL string (e.g. https://... ) */
  bannerImage?: string;
  /** Resolved banner image source (URL). Use this directly as an Image uri: { uri: bannerImageSrc } */
  bannerImageSrc?: string;
  // Optional location for events that are tied to a place (used for hidden events)
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  // Hidden events are not shown until the user is nearby
  hidden?: boolean;
}

export interface EventsFile {
  events: EventData[];
}
