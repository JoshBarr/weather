import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import "../styles/globals.css";
import type { AppProps } from "next/app";

/**
 * Mock out the server-side API using MSW
 */
// require("../lib/mocks");

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

/**
 * Sync the state of our application into localStorage,
 * so that it can display data even if the network is unavailable
 */
const persister = createSyncStoragePersister({
  storage: "window" in global ? window.localStorage : undefined,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      {process.env.DEVTOOLS && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
