import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { WeatherLocation } from "@weather/lib/types/locations";
import { Precipitation } from "@weather/lib/types/weatherService";

export const useRainAlert = ({
  location,
  precipitation,
}: {
  location?: WeatherLocation;
  precipitation?: Precipitation;
}) => {
  const precipitationRef = useRef(precipitation);

  useEffect(() => {
    if (!location?.isSubscribedToAlerts) {
      return;
    }

    const previousPrecipitation = precipitationRef.current;
    const nextPrecipitation = precipitation;
    precipitationRef.current = nextPrecipitation;

    if (
      previousPrecipitation &&
      nextPrecipitation &&
      nextPrecipitation !== previousPrecipitation
    ) {
      if (nextPrecipitation === "not-rain") {
        toast(`It's stopped raining in ${location?.address}`, {
          // note: set an ID to ensure there's only one notification shown.
          // this prevents them from stacking up over the whole screen.
          id: "rain-toast",
        });
      } else {
        toast(`It's raining in ${location?.address}`, {
          id: "rain-toast",
        });
      }
    }
  }, [precipitation, location?.address, location?.isSubscribedToAlerts]);
};
