import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { UserAccount } from "@/components/UserAccount";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LogProvider } from "@/contexts/LogContext";
import { ColorModeProvider } from "@/contexts/ColorModeContext";
import { SongsProvider } from "@/contexts/SongsContext";
import { ColumnVisibilityProvider } from "@/contexts/ColumnVisibilityContext";
import { UserProvider } from "@/contexts/UserContext";
import { LogWindow } from "@/components/LogWindow";
import Index from "./pages/Index";
import Songs from "./pages/Songs";
import Folders from "./pages/Folders";
import Playlists from "./pages/Playlists";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <ColorModeProvider>
          <SongsProvider>
            <ColumnVisibilityProvider>
              <LogProvider>
            
            <Sonner />
            <BrowserRouter>
            <SidebarProvider>
              <div className="h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <header className="h-12 sm:h-14 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                    <SidebarTrigger className="ml-4" />
                    <div className="mr-4">
                      <UserAccount />
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto overflow-x-hidden">
                          <Routes>
                            {/* Public routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            {/* Protected routes */}
                            <Route path="/" element={
                              <ProtectedRoute>
                                <Index />
                              </ProtectedRoute>
                            } />
                            <Route path="/songs" element={
                              <ProtectedRoute>
                                <Songs />
                              </ProtectedRoute>
                            } />
                            <Route path="/folders" element={
                              <ProtectedRoute>
                                <Folders />
                              </ProtectedRoute>
                            } />
                            <Route path="/playlists" element={
                              <ProtectedRoute>
                                <Playlists />
                              </ProtectedRoute>
                            } />
                            <Route path="/settings" element={
                              <ProtectedRoute>
                                <Settings />
                              </ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                              <ProtectedRoute>
                                <Admin />
                              </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            } />
                            
                            {/* 404 route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                  </main>
                </div>
                <LogWindow />
              </div>
            </SidebarProvider>
          </BrowserRouter>
              </LogProvider>
            </ColumnVisibilityProvider>
          </SongsProvider>
        </ColorModeProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
