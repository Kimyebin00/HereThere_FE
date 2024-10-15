type postData = {
  id: number;
  title: string;
  maxCapacity: number;
  currentPerson: number;
  description: string;
  startTime: null;
  date: string;
  category: string;
  user: {
    userId: number;
    username: string;
  },
  location: {
    id: number;
    latitude: number;
    longitude: number;
    locationName: string;
  },
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  status: string;
};

type editModalBoxProps = {
  postData: postData;
  clickModal: () => void;
};

export default editModalBoxProps;
