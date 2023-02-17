export type WeatherLocation = {
  address: string;
  isSubscribedToAlerts: boolean;
  id?: string;
};

export type LocationsResponse = {
  locations: WeatherLocation[];
};
