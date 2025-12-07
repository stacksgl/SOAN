import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Bell
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useColorMode } from "@/contexts/ColorModeContext";
import { toast } from "@/components/ui/sonner";

export function UserAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useUser();
  const { isColorModeEnabled } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
        <div className="w-16 h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return null; // Don't show anything when not logged in
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 btn-minimal hover-minimal"
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.avatar} alt={user.name || 'User'} />
            <AvatarFallback className="text-minimal-xs bg-muted">
              {getUserInitials(user.name || user.email?.split('@')[0] || 'U')}
            </AvatarFallback>
          </Avatar>
          <span className="text-minimal-sm font-medium hidden sm:inline">
            {user.name || user.email?.split('@')[0] || 'User'}
          </span>
          <ChevronDown className="icon-minimal-xs text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card-minimal border-minimal shadow-minimal-lg"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.name || 'User'} />
              <AvatarFallback className="text-minimal-sm bg-muted">
                {getUserInitials(user.name || user.email?.split('@')[0] || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-minimal-sm font-medium">{user.name || user.email?.split('@')[0] || 'User'}</span>
              <span className="text-minimal-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-minimal-sm">
            <User className="icon-minimal-sm" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-minimal-sm">
            <Settings className="icon-minimal-sm" />
            Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="flex items-center gap-2 px-3 py-2 text-minimal-sm">
            <Bell className="icon-minimal-sm" />
            Notifications
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-minimal-sm">
            <Shield className="icon-minimal-sm" />
            Admin Panel
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-minimal-sm text-red-400 hover:text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="icon-minimal-sm" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
