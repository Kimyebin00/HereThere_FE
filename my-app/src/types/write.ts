export type requestPostData = {
  title: string;
  category: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  maxCapacity: number;
  date: string;
  startTime: string;
};

export type responsePostData = {
  id: number;
  title: string;
  maxCapacity: number;
  currentPerson: number;
  description: string;
  startTime: string;
  date: string;
  category: string;
  location: {
    id: number;
    latitude: number;
    longitude: number;
    locationName: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  status: string;
  user: {
    userId: number;
    username: null | string;
  };
  editable: boolean;
};
