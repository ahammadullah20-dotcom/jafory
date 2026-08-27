import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { CommerceProvider } from "./contexts/CommerceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ComparePage from "./pages/ComparePage";
import Home from "./pages/Home";
import InformationPage from "./pages/InformationPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";

function LegacyAdminRoute() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/admin", { replace: true }); }, [setLocation]);
  return <div className="admin-gate">Opening Jafory control panel…</div>;
}

function RecoveryHashRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isRootRecovery = window.location.pathname === "/" && window.location.hash.includes("type=recovery");
    if (isRootRecovery) {
      // Preserve Supabase's fragment for its client-side session detector; never log or inspect token values.
      setLocation(`/account?recovery=1${window.location.hash}`, { replace: true });
    }
  }, [setLocation]);

  return null;
}

function Router() {
  return (
    <>
      <RecoveryHashRedirect />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/account" component={AccountPage} />
        <Route path="/categories/:slug" component={CategoryPage} />
        <Route path="/categories" component={CategoryPage} />
        <Route path="/categories/" component={CategoryPage} />
        <Route path="/products/:slug" component={ProductPage} />
        <Route path="/compare" component={ComparePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/about">{() => <InformationPage kind="about" />}</Route>
        <Route path="/privacy">{() => <InformationPage kind="privacy" />}</Route>
        <Route path="/disclosure">{() => <InformationPage kind="disclosure" />}</Route>
        <Route path="/contact">{() => <InformationPage kind="contact" />}</Route>
        <Route path="/terms">{() => <InformationPage kind="terms" />}</Route>
        <Route path="/readiness">{() => <InformationPage kind="readiness" />}</Route>
        <Route path="/admin" component={AdminPage} />
        <Route path="/ad" component={LegacyAdminRoute} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CommerceProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CommerceProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
