import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import AIBoard from "./pages/AIBoard";
import Dashboard from "./pages/Dashboard";
import ChatHistory from "./pages/ChatHistory";
import AITools from "./pages/AITools";
import CustomCursor from "./components/CustomCursor";
import ProjectBoards from "./pages/ProjectBoards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="brainstack-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Custom dual-layer cursor */}
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            {/* Landing page - no sidebar */}
            <Route path="/" element={<Index />} />

            {/* Authenticated routes - with sidebar */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/:projectId/boards" element={<ProjectBoards />} />
              <Route path="/ai-board" element={<AIBoard />} />
              <Route path="/history" element={<ChatHistory />} />
              <Route path="/ai-tools" element={<AITools />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
