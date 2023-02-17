import { WeatherForecast } from "@weather/lib/types/weatherService";
import { formatHours } from "@weather/lib/timeFormats";
import React from "react";
import { Temperature, TemperatureUnit } from "./Temperature";

const Hour = ({
  time,
  degrees,
  unit,
}: WeatherForecast["temp"]["hourly"][0] & { unit: TemperatureUnit }) => {
  return (
    <div key={time} className="border-b grid grid-cols-2">
      <dt className="text-slate-600">{formatHours(time)}</dt>
      <dd className="text-right">
        <Temperature unit={unit} temperature={degrees} />
      </dd>
    </div>
  );
};

export const HourlyForecast = ({
  temp,
  unit,
}: {
  temp: Pick<WeatherForecast["temp"], "hourly">;
  unit: TemperatureUnit;
}) => {
  const morning = temp.hourly.slice(0, 12);
  const afternoon = temp.hourly.slice(12);

  return (
    <dl className="grid grid-cols-2 max-w-md gap-20 text-sm">
      <div>
        {morning.map((hour) => (
          <Hour key={hour.time} {...hour} unit={unit} />
        ))}
      </div>
      <div>
        {afternoon.map((hour) => (
          <Hour key={hour.time} {...hour} unit={unit} />
        ))}
      </div>
    </dl>
  );
};
