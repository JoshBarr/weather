import { fetch } from "@whatwg-node/fetch";

/**
 * React Query can retry execeptions for us.
 *
 * Given more time we'd implement proper status code
 * handling for all the API methods, and present all
 * relevant errors back to the user.
 */
export const fetchClient = async (init: RequestInfo, options?: RequestInit) => {
  const response = await fetch(init, options);
  if (!response.ok) {
    throw new Error("fetch failed");
  }
  return response;
};
