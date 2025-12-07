import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  User, 
  Lock, 
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useColorMode } from "@/contexts/ColorModeContext";
import { toast } from "@/components/ui/sonner";

const Profile = () => {
  const { user, updateUser, logout } = useUser();
  const { isColorModeEnabled } = useColorMode();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="container-minimal">
        <div className="text-center py-8">
          <p className="text-minimal-sm text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(profileData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error("Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/user/delete', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logout();
      toast.success("Account deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="container-minimal">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-minimal-2xl font-bold ${isColorModeEnabled ? 'text-gradient-minimal' : 'text-foreground'}`}>
          Profile Settings
        </h1>
        <p className="text-minimal-sm text-muted-foreground mt-1">
          Manage your account information and security settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <User className="icon-minimal" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-minimal-sm">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-minimal bg-background border-minimal text-minimal-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-minimal-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-minimal bg-background border-minimal text-minimal-sm"
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="btn-minimal" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="text-minimal-sm">Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 icon-minimal-sm" />
                      <span className="text-minimal-sm">Update Profile</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <Lock className="icon-minimal" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-minimal-sm">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="input-minimal pr-10 bg-background border-minimal text-minimal-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-minimal-sm w-6 h-6 p-0"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="icon-minimal-xs" />
                    ) : (
                      <Eye className="icon-minimal-xs" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-minimal-sm">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="input-minimal pr-10 bg-background border-minimal text-minimal-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-minimal-sm w-6 h-6 p-0"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="icon-minimal-xs" />
                    ) : (
                      <Eye className="icon-minimal-xs" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-minimal-sm">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input-minimal pr-10 bg-background border-minimal text-minimal-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-minimal-sm w-6 h-6 p-0"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="icon-minimal-xs" />
                    ) : (
                      <Eye className="icon-minimal-xs" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="btn-minimal" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="text-minimal-sm">Changing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 icon-minimal-sm" />
                      <span className="text-minimal-sm">Change Password</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal border-red-500/20">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg text-red-400">
              <AlertTriangle className="icon-minimal" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0">
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <h3 className="text-minimal-sm font-semibold text-red-400 mb-2">Delete Account</h3>
                <p className="text-minimal-xs text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="btn-minimal-sm bg-red-500 hover:bg-red-600 text-white"
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-2 icon-minimal-xs" />
                      <span className="text-minimal-xs">Delete Account</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card-minimal border-minimal shadow-minimal-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-minimal-lg text-red-400">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-minimal-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="btn-minimal-sm">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="btn-minimal-sm bg-red-500 hover:bg-red-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span className="text-minimal-xs">Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 icon-minimal-xs" />
                            <span className="text-minimal-xs">Yes, delete my account</span>
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
