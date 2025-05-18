
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const LoginForm = () => {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use callbacks to prevent unnecessary re-renders
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    console.log(`Submitting ${activeTab} form with email: ${email}`);
    
    try {
      if (activeTab === "login") {
        await login(email, password);
        // Auth context will handle redirection after successful login
      } else {
        await signup(email, password, name);
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account."
        });
        // Switch to login tab after successful signup
        setActiveTab("login");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error?.message || "Authentication failed. Please try again.");
      // Error toasts are handled in authService
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {activeTab === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {activeTab === "login"
            ? "Sign in to your account to continue"
            : "Fill out the form to create your account"}
        </CardDescription>
      </CardHeader>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "login" | "signup")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={submitting}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={handleNameChange}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={submitting}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
