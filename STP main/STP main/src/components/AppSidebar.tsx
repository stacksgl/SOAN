import { BarChart3, Music, PlayCircle, Settings, Folder, Shield } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useColorMode } from "@/contexts/ColorModeContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Songs", url: "/songs", icon: Music },
  { title: "Folders", url: "/folders", icon: Folder },
  { title: "Playlists", url: "/playlists", icon: PlayCircle },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Admin", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { isColorModeEnabled } = useColorMode();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? (isColorModeEnabled ? "bg-primary text-primary-foreground font-medium" : "bg-muted text-foreground font-medium") : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent className="bg-card-minimal border-r border-minimal glass-minimal">
        <div className="p-3">
          <h2 className={`font-bold text-minimal-lg text-foreground ${isCollapsed ? "hidden" : "block"}`}>
            SOAN
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={`text-minimal-xs ${isCollapsed ? "hidden" : "block"}`}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={`${getNavCls} btn-minimal hover-minimal`}
                    >
                      <item.icon className="icon-minimal-sm" />
                      {!isCollapsed && <span className="text-minimal-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}