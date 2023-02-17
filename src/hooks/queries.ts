import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLocation,
  getForecast,
  getLocation,
  getLocations,
  getSuggestions,
  removeLocation,
  updateLocation,
} from "@weather/components/api";
import { WeatherLocation } from "@weather/lib/types/locations";

export const useGetLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
    initialData: [],
  });
};

export const useGetLocation = (address: string) => {
  return useQuery({
    queryKey: ["locations", address],
    queryFn: async () => {
      const result = await getLocation(address);
      return result || { address, isSubscribedToAlerts: false };
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetForecast = (address: string) => {
  return useQuery({
    queryKey: ["locations", address, "forecast"],
    queryFn: () => {
      return getForecast(address);
    },
    refetchOnWindowFocus: false,
    enabled: !!location,
    // cache the forecast for an hour
    cacheTime: 1000 * 60 * 60,
  });
};

export const useGetSuggestions = (query: string) => {
  return useQuery(
    ["search", query],
    () => {
      if (query) {
        return getSuggestions(query);
      }
      return [];
    },
    {
      refetchOnWindowFocus: false,
      initialData: [],
    }
  );
};

export const useAddCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLocation,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["locations", data.address], data);
      }
      queryClient.invalidateQueries({ queryKey: ["locations"], exact: true });
    },
    /**
     * Optimistically update the list of cards, before we receive success
     * from the server.
     */
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["locations"] });
      const previousItems = queryClient.getQueryData(["locations"]) || [];
      queryClient.setQueryData<WeatherLocation[]>(["locations"], (old = []) => {
        return [...old, newItem];
      });
      return { previousItems };
    },
    retry: 2,
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["locations", data?.address], data);
      }
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({
        queryKey: ["locations", newItem.address],
      });
      const previousItem = queryClient.getQueryData([
        "locations",
        newItem.address,
      ]);
      queryClient.setQueryData(["locations", newItem.address], newItem);
      return { previousItem, newItem };
    },
    onError: (_err, _newItem, context) => {
      queryClient.setQueryData(
        ["locations", context?.newItem.address],
        context?.previousItem || null
      );
    },
    onSettled: (newItem) => {
      queryClient.invalidateQueries({
        queryKey: ["locations", newItem?.address],
      });
    },
  });
};

export const useRemoveCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeLocation,
    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: ["locations", data?.address],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["locations"], exact: true });
    },
  });
};
