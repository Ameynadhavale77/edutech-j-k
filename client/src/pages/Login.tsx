import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const devLoginMutation = useMutation({
    mutationFn: async () => {
      // First try to register, then login (for testing)
      try {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email || "test@example.com",
            password: password || "test123",
            firstName: "Test",
            lastName: "User"
          })
        });
      } catch {}
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email || "test@example.com",
          password: password || "test123"
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Development login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful!",
        description: `Welcome ${data.user.firstName || 'back'}!`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="text-primary-foreground w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to EduPath J&K</CardTitle>
          <CardDescription>
            Login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {devLoginMutation.error && (
            <Alert variant="destructive" data-testid="alert-login-error">
              <AlertDescription>
                {devLoginMutation.error?.message || "Login failed. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-dev-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="test123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-dev-password"
              />
            </div>
            <Button
              onClick={() => devLoginMutation.mutate()}
              disabled={devLoginMutation.isPending}
              className="w-full"
              data-testid="button-dev-login"
            >
              {devLoginMutation.isPending ? "Signing in..." : "Login"}
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              Use test@example.com / test123 or enter your own
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}