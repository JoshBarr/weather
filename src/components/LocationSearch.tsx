import { useEffect, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import { RxCheck } from "react-icons/rx";
import { ulid } from "ulidx";

import { useAddCard, useGetSuggestions } from "@weather/hooks/queries";

interface LocationSearchProps {
  /**
   * An array of all the locations that have already been chosen.
   * This prevents the user from adding the same location multiple times.
   */
  omittedLocations: string[];
}

/**
 * Chooses the location.
 *
 * Note: in a real-world implementation, this would be a typeahead search of
 * all possible locations on earth. We've stubbed the list for this demo.
 */
export const LocationSearch: React.FC<LocationSearchProps> = ({
  omittedLocations,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { data: locations, isLoading } = useGetSuggestions(query);
  const addCardMutation = useAddCard();

  const addCard = (location: string) => {
    addCardMutation.mutate({
      id: ulid(),
      address: location,
      isSubscribedToAlerts: false,
    });
  };

  const availableLocations = locations.filter(
    (location) => !omittedLocations.includes(location)
  );

  const filteredLocations =
    query === ""
      ? availableLocations
      : availableLocations.filter((location) => {
          return location.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="max-w-md">
      <Combobox value={""} onChange={addCard} disabled={isLoading}>
        <div className="relative z-10">
          <label htmlFor="location-search" className="block mb-2">
            Add a location
          </label>
          <Combobox.Input
            ref={inputRef}
            className={
              "w-full border-none bg-white shadow-md rounded-md  py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            }
            name="location-search"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Options className="absolute mt-1 max-h-60 max-w-sm w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredLocations.map((location) => (
              <Combobox.Option
                key={location}
                value={location}
                className="ui-active:bg-blue-500 p-2 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
              >
                {({ active, selected }) => (
                  <div
                    className={`p-1 rounded-sm ${
                      active ? "bg-blue-500 text-white" : "bg-white text-black"
                    }`}
                  >
                    {selected && <RxCheck />}
                    {location}
                  </div>
                )}
              </Combobox.Option>
            ))}
            {!filteredLocations.length ? (
              <div className="p-2">no results</div>
            ) : null}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
};
