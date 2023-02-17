import { useState } from "react";
import { LocationSearch } from "./LocationSearch";
import { TemperatureUnit, TEMPERATURE_UNITS } from "./Temperature";
import { WeatherCard } from "./WeatherCard";
import { Spinner } from "./Spinner";
import { UnitButton } from "./UnitButton";
import { useWebSocketSubscription } from "@weather/hooks/useWebSocketSubscription";
import { Toaster } from "react-hot-toast";
import { between } from "@weather/mocks/weather";
import { useGetLocations } from "@weather/hooks/queries";
import { MockTools } from "./MockTools";

export interface WeatherViewProps {}

export const WeatherView: React.FC<
  WeatherViewProps
> = ({}: WeatherViewProps) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(
    TEMPERATURE_UNITS.celcius
  );

  const { data: locations, isLoading } = useGetLocations();
  const { sendMessage, isSocketOpen } = useWebSocketSubscription();

  /**
   * Trigger a socket event, so we can show how the application
   * react to a real-time notification. We pick a random location
   * to update each time the button is clicked.
   */
  const simulateWebSocketEvent = () => {
    const randomIndex = between(0, locations.length - 1);
    const randomLocation = locations.at(randomIndex);

    if (!randomLocation) {
      return;
    }

    sendMessage({
      entity: ["locations"],
      id: randomLocation.address,
    });
  };

  const omittedLocations = locations.map((card) => card.address);

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl mb-4">Merriweather</h1>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div>
          {" "}
          {!isLoading ? (
            <LocationSearch omittedLocations={omittedLocations} />
          ) : null}
        </div>
        <div className="text-right">
          <UnitButton
            selected={temperatureUnit === TEMPERATURE_UNITS.celcius}
            onClick={() => setTemperatureUnit(TEMPERATURE_UNITS.celcius)}
            unit={"C"}
            label={TEMPERATURE_UNITS.celcius}
          />
          <UnitButton
            selected={temperatureUnit === TEMPERATURE_UNITS.fahrenheit}
            onClick={() => setTemperatureUnit(TEMPERATURE_UNITS.fahrenheit)}
            unit={"F"}
            label={TEMPERATURE_UNITS.fahrenheit}
          />
        </div>
      </div>
      <Toaster />
      <MockTools
        len={locations.length}
        isSocketOpen={!!isSocketOpen}
        simulateWebSocketEvent={simulateWebSocketEvent}
      />
      {isLoading ? (
        <>
          Loading <Spinner />
        </>
      ) : null}
      {!isLoading && locations.length === 0 ? "No locations" : null}

      <div className="grid grid-cols-1 gap-4">
        {locations.map((card) => {
          return (
            <WeatherCard
              key={card.address}
              unit={temperatureUnit}
              address={card.address}
            ></WeatherCard>
          );
        })}
      </div>
    </div>
  );
};
