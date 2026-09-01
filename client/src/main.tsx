import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sonner";
import { supabase } from "./lib/supabase";
import "./index.css";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: false, refetchOnReconnect: false } } });
const reportApiError = (error: unknown) => { if (error instanceof TRPCClientError) console.error("[API Error]", error.message); };
queryClient.getQueryCache().subscribe(event => { if (event.type === "updated" && event.action.type === "error") reportApiError(event.query.state.error); });
queryClient.getMutationCache().subscribe(event => { if (event.type === "updated" && event.action.type === "error") reportApiError(event.mutation.state.error); });

const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson, async headers() { const { data } = await supabase.auth.getSession(); return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}`, "X-Supabase-Access-Token": data.session.access_token } : {}; }, fetch(input, init) { return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" }); } })],
});

createRoot(document.getElementById("root")!).render(<ErrorBoundary><trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><App /></QueryClientProvider></trpc.Provider><Toaster position="top-center" richColors closeButton /></ErrorBoundary>);
