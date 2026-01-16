import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import SiteHeader from "./components/siteHeader/siteHeader";
/**
 * Import React Query's core client + provider.
 * QueryClient manages caching, deduping, and background fetching.
 *
 * https://tanstack.com/query/latest/docs/framework/react/reference/QueryClient
 * */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "./contexts/searchRoomsContext";

/**
 * Create a new QueryClient instance for the whole app,
 * which will manage the cache.
 *
 * https://tanstack.com/query/latest/docs/framework/react/reference/QueryClient
 * */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays "fresh" for 5 minutes
      refetchOnWindowFocus: false, // Don’t refetch when user switches tabs
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/**
       * SearchProvider from 'SearchRoomContext' provider
       * that exposes room search-related functions.
       */}
      <SearchProvider>
        <BrowserRouter>
          <SiteHeader />
          <App />
        </BrowserRouter>
      </SearchProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
