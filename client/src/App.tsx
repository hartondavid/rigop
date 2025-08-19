import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Contracts from "@/pages/contracts";
import TouchPoints from "@/pages/touch-points";
import Compliance from "@/pages/compliance";
import Analytics from "@/pages/analytics";
import AuditTrail from "@/pages/audit-trail";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/contracts" component={Contracts} />
          <Route path="/touch-points" component={TouchPoints} />
          <Route path="/compliance" component={Compliance} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/audit-trail" component={AuditTrail} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gov-light">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
