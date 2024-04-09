export interface Venue {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}
interface Topic {
  name: string;
}

export interface TopicEdge {
  cursor: string;
  node: Topic;
}

export interface LocalEvent {
  title: string;
  imageUrl: string;
  eventUrl: string;
  image: { baseUrl: string };
  going: boolean;
  howToFindUs: string;
  description: string;
  shortDescription: string;
  dateTime: string;
  endTime: string;
  topics: {
    count: number;
    edges: TopicEdge[];
  };
  venue?: Venue;
}

export interface MeetupResponse {
  count: number;
  edges?: {
    cursor: string;
    node: {
      id: string;
      result: LocalEvent;
    };
  }[];
}
