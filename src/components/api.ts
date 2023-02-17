import { fetchClient } from "../lib/fetchClient";
import {
  LocationsResponse,
  WeatherLocation,
} from "@weather/lib/types/locations";
import {
  GeocodeAddressResult,
  GetForecastByCoordinatesResult,
} from "@weather/lib/types/weatherService";
import { ulid } from "ulidx";

// Note: node only supports absolute URLs for fetch
const ENDPOINT = "http://localhost:3000";

export async function getForecast(location: string) {
  const locationResult = await fetchClient(
    `${ENDPOINT}/api/coordinates/${encodeURIComponent(location)}`
  );
  const {
    data: { lat, long },
  } = (await locationResult.json()) as GeocodeAddressResult;

  const forecast = await fetchClient(`${ENDPOINT}/api/forecast/${lat}/${long}`);

  const { data: forecastResult } =
    (await forecast.json()) as GetForecastByCoordinatesResult;
  return {
    location,
    id: ulid(),
    ...forecastResult,
  };
}

export async function getSuggestions(query: string) {
  const res = await fetchClient(
    `${ENDPOINT}/api/search?q=${encodeURIComponent(query)}`
  );
  const result = (await res.json()) as { locations: string[] };
  return result.locations;
}

export async function addLocation(card: WeatherLocation) {
  const response = await fetchClient(`${ENDPOINT}/api/locations`, {
    method: "POST",
    body: JSON.stringify(card),
  });
  const result = (await response.json()) as LocationsResponse;
  return result.locations.find((item) => item.address === card.address);
}

export async function updateLocation(card: WeatherLocation) {
  const response = await fetchClient(`${ENDPOINT}/api/locations`, {
    method: "PUT",
    body: JSON.stringify(card),
  });
  const result = (await response.json()) as LocationsResponse;
  return result.locations.find((item) => item.address === card.address);
}

export async function removeLocation(address: WeatherLocation["address"]) {
  const response = await fetchClient(
    `${ENDPOINT}/api/locations?location=${encodeURIComponent(address)}`,
    {
      method: "DELETE",
    }
  );
  const result = (await response.json()) as LocationsResponse;
  return result.locations.find((item) => item.address === address);
}

export async function getLocations() {
  const response = await fetchClient(`${ENDPOINT}/api/locations`);
  const result = (await response.json()) as LocationsResponse;
  return result.locations;
}

export async function getLocation(address: string) {
  const result = await getLocations();
  return result.find((item) => item.address === address);
}
