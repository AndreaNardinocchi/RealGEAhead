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
import AuthContextProvider from "./contexts/authContext";
// https://docs.stripe.com/payments/save-and-reuse#web-create-setup-intent
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

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

// Call 'loadStripe' only once, outside our component. If we call it inside the component,
// React would run it on every render, which would create a new Stripe instance each time and break things.
// https://docs.stripe.com/sdks/stripejs-react
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
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
          <AuthContextProvider>
            {/**
             * It creates a shared Stripe context that all child components can use.
             * Everything inside <Elements> gets access to Stripe inclusing useStripe(), useElements(),
             * <CardElement />, etc.
             * stripe={stripePromise} gives the provider our initialized Stripe instance.
             * https://docs.stripe.com/sdks/stripejs-react?ui=elements
             * https://stackoverflow.com/questions/69124551/how-to-load-stripe-promise-outside-of-react-component#69139343
             */}
            <Elements stripe={stripePromise}>
              <SiteHeader />

              <App />
            </Elements>
          </AuthContextProvider>
        </BrowserRouter>
      </SearchProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
