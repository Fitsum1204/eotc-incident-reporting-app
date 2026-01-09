// sanity/lib/client-fetch.ts
import { client } from "./client"; // make sure this exists

interface FetchOptions {
  query: string;
  params?: Record<string, any>;
}

export const sanityFetch = async ({ query, params = {} }: FetchOptions) => {
  try {
    return await client.fetch(query, params);
  } catch (err) {
    console.error("Sanity fetch error:", err);
    return [];
  }
};
