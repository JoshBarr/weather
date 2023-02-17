# Weather App

## QuickStart

```sh
pnpm install
pnpm dev
# then vtisit http://localhost:3000

# run unit tests
pnpm test

# run e2e tests
pnpm test:e2e
```

## Requirements

See the [Google Doc](https://docs.google.com/document/d/1NyBBdb_F_6r6OHRkmBiPkt-zBX6wpK8X3IyT8-2mtG4/edit#heading=h.jkqbjl2tmg47)

## Design decisions

- Each new browser visiting the app gets a unique sessionId. It's stored in a cookie, so we can read it in our `/api/*` routes.
- [react-query](https://tanstack.com/query/latest/docs/react/overview) is used as the data fetching library. React Query is a global singleton cache for storing data, with ergonomic ways to invalidate and re-fetch the data, based on the `queryKey`. Since we may have future requirements (such as realtime), it makes sense to use a caching strategy that allows for any transport method (fetch, websockets, etc) to update the data.
- The cards are stored against the sessionId session in a mock database at `./db.json`, using [lowdb](https://github.com/typicode/lowdb). In the future, this would allow the cards to be shared across devices, by mapping the session to an email address (not implemented).
- We use optimistic updates for adding cards.
- Card data is cached into localStorage as well as synced to the server
- A `Mock Tools` bar appears at the bottom to simulate websockets, using the [Postman echo service](https://blog.postman.com/introducing-postman-websocket-echo-service/).

## Assumptions

- Users are okay with integer temperatures
- The default temp is ºC
- Addresses for the geocode can be looked up from an addressfinder, rather than freetext. This reduces the chance of errors around the address, at the cost of only supporting known addresses. For a weather app, that feels like an acceptable tradeoff. This way, the API can
- User session management is out of scope. If you need to get a different `sessionId`, clear cookies for `localhost:3000`.

## TODO

Things I didn't get done:

- [ ] Drag and drop. [React DnD](https://react-dnd.github.io/react-dnd/examples/sortable/simple) is the usual solution here. Sortable lists are achieved by making each item a drop target and drag target. The order of cards would be stored in a `useState<string[]>()` on `WeatherView.tsx`, and synced back to the server by storing an additonal key on the session, such as `cardOrder: string[]`, where the `string` is the address.
- [ ] Syncing your temperature preference back to the server. When you refresh the page, your celcius/fahrenheit preference is reset.
- [ ] Realtime incremental updates. This app uses websockets to invalidate the cache, and refetch from the forecast API endpoint. True realtime incremental updates have [several trade-offs](https://tkdodo.eu/blog/using-web-sockets-with-react-query#partial-data-updates) that increase the scope considerably. In all likelihood, the weather data is going to be heavily cached by the API provider behind the websocket.
- [ ] Closing toasts. The [react-hot-toast docs](https://react-hot-toast.com/docs/toast-bar) have an example, should we decide to implement this in future.

## What I'd like to add next

- [ ] Timezone and current time for each location
- [ ] Weather icon for each time of day (e.g morning, afteroon, evening)
- [ ] An indication of elapsed time through the day. See [Metservice](https://www.metservice.com/towns-cities/locations/wellington) for an example. They also chart rainfall at specific times of day, which is a nice feature for planning your activities.

## Installation

This project uses [pnpm](https://pnpm.io/installation).

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Developing

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load fonts.

## Testing

Unit tests are written in Jest

```
pnpm test
```

e2e tests are written in playwright

```sh
pnpm run test:e2e
# to debug a test
pnpm run test:e2e:debug
```
