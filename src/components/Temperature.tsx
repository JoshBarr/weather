export type TemperatureUnit =
  (typeof TEMPERATURE_UNITS)[keyof typeof TEMPERATURE_UNITS];

export interface TemperatureProps {
  temperature?: number;
  unit: TemperatureUnit;
  prominence?: "high" | "low";
  style?: "block" | "inline";
}

export const TEMPERATURE_UNITS = {
  celcius: "celcius" as const,
  fahrenheit: "fahrenheit" as const,
};

export const Temperature: React.FC<TemperatureProps> = ({
  temperature,
  prominence,
  unit,
  style,
}) => {
  const symbol = unit.at(0)?.toUpperCase();

  return (
    <span
      data-testid="temperature"
      className={`${style === "block" ? "text-5xl" : ""} ${
        prominence === "high" ? "text-slate-700" : "text-slate-500"
      }`}
    >
      {temperature}
      <span className={style === "block" ? "text-base align-top" : ""}>
        º{symbol}
      </span>
    </span>
  );
};
