import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  LogIn,
  UserPlus
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useColorMode } from "@/contexts/ColorModeContext";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/sonner";
import { loginWithGoogleSession, fetchMe } from "@/lib/authSession";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isColorModeEnabled } = useColorMode();
  const { login, isLoading, refreshUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    if (success) {
      toast.success("Login successful!");
      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...');
      await loginWithGoogleSession();
      console.log('Google login successful, waiting for cookie...');
      
      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh user context to get the logged in user
      await refreshUser();
      console.log('User refreshed, navigating...');
      
      toast.success("Google login successful!");
      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/";
      console.log('Navigating to:', from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-minimal-2xl font-bold ${isColorModeEnabled ? 'text-gradient-minimal' : 'text-foreground'}`}>
            Welcome Back
          </h1>
          <p className="text-minimal-sm text-muted-foreground mt-1">
            Sign in to your SOAN account
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-card-minimal border-minimal shadow-minimal-lg glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <LogIn className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-minimal-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-minimal bg-background border-minimal text-minimal-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-minimal-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-minimal pr-10 bg-background border-minimal text-minimal-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-minimal-sm w-6 h-6 p-0"
                  >
                    {showPassword ? (
                      <EyeOff className="icon-minimal-xs" />
                    ) : (
                      <Eye className="icon-minimal-xs" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-minimal" />
                  <span className="text-minimal-xs text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-minimal-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full btn-minimal-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="text-minimal-sm">Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="icon-minimal-sm" />
                    <span className="text-minimal-sm">Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full btn-minimal-lg"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-minimal-sm">Continue with Google</span>
              </Button>

              <div className="text-center">
                <p className="text-minimal-xs text-muted-foreground mb-3">
                  Don't have an account?
                </p>
                <Link to="/register">
                  <Button variant="outline" className="w-full btn-minimal">
                    <UserPlus className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Create Account</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
