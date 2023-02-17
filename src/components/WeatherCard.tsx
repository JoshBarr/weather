import { MouseEventHandler, useState } from "react";
import { temperaturesToFahrenheight } from "@weather/lib/weatherFormats";
import { TemperatureUnit } from "./Temperature";
import { RxCross2, RxTrash } from "react-icons/rx";
import { Forecast } from "./Forecast";
import { button } from "./styles";
import { HourlyForecast } from "./HourlyForecast";
import { Delayed } from "./Delayed";
import { Spinner, SpinnerInline } from "./Spinner";
import {
  useGetForecast,
  useGetLocation,
  useRemoveCard,
  useUpdateCard,
} from "@weather/hooks/queries";
import { useRainAlert } from "@weather/hooks/useRainAlert";

export type WeatherCardProps = {
  address: string;
  unit: TemperatureUnit;
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ address, unit }) => {
  const [isOpen, setOpen] = useState(false);

  const { data: location } = useGetLocation(address);
  const { data: forecast, isLoading, isRefetching } = useGetForecast(address);

  const updateLocationMutation = useUpdateCard();
  const removeCardMutation = useRemoveCard();

  useRainAlert({ location, precipitation: forecast?.precipitation });

  const toggleRainAlerts: MouseEventHandler = () => {
    if (!location) {
      return;
    }

    updateLocationMutation.mutate({
      ...location,
      isSubscribedToAlerts: !location.isSubscribedToAlerts,
    });
  };

  const handleShowHide: MouseEventHandler = () => {
    setOpen(!isOpen);
  };

  const removeCard = (address: string) => {
    removeCardMutation.mutate(address);
  };

  const temp =
    unit === "celcius"
      ? forecast?.temp
      : temperaturesToFahrenheight(forecast?.temp);

  return (
    <div
      data-testid="weather-card"
      className="container relative mx-auto py-3 px-4 mb-4 bg-white rounded-md border drop-shadow-md"
    >
      <button
        aria-label="Remove card"
        className={`${button} absolute top-2 right-2 py-2 ${
          removeCardMutation.isLoading ? "animate-spin" : ""
        }}`}
        onClick={() => removeCard(address)}
      >
        {removeCardMutation.isSuccess ? (
          <RxTrash />
        ) : removeCardMutation.isLoading ? (
          <Spinner />
        ) : (
          <RxCross2 />
        )}
      </button>

      <h3 className="text-lg font-medium mb-4">{address}</h3>

      {forecast
        ? forecast.precipitation === "rain"
          ? "It's raining"
          : "Not raining"
        : "No rain data"}

      {isLoading ? "Loading forecast..." : null}

      {forecast && temp ? (
        <>
          <Forecast
            temp={temp}
            weather={forecast.weather}
            unit={unit}
          ></Forecast>

          <div className="mb-2">
            <button
              disabled={updateLocationMutation.isLoading}
              className={`${button} w-24 mr-2 `}
              onClick={handleShowHide}
            >
              {isOpen ? "Collapse" : "Expand"}
            </button>

            {location ? (
              <button className={`${button} mr-2 `} onClick={toggleRainAlerts}>
                {location.isSubscribedToAlerts
                  ? "Disable rain alerts"
                  : "Enable rain alerts"}
                {updateLocationMutation.isLoading && (
                  <span className="ml-2">
                    <SpinnerInline />
                  </span>
                )}
              </button>
            ) : null}

            {isRefetching && !removeCardMutation.isLoading ? (
              <Delayed waitFor={100}>
                <>
                  <span className="mr-2">Forecast updating</span>
                  <SpinnerInline />
                </>
              </Delayed>
            ) : null}
          </div>

          {isOpen ? <HourlyForecast temp={temp} unit={unit} /> : null}
        </>
      ) : null}
    </div>
  );
};
