export interface Board {
  id: number;
  userId: number;
  title: string;
  category: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  maxCapacity: number;
  date: string;
  startTime: string;
  status?: "OPEN" | "CLOSED";
  currentPerson: number;
}
