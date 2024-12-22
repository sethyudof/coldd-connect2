import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Log the current session for debugging
    console.log("Checking auth state...");
    supabase.auth.getSession().then(({ data: { session }}) => {
      console.log("Current session:", session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    toast.error("Authentication Error", {
      description: error.message || "An unexpected error occurred during authentication"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">COLDD Contact</h1>
          <p className="text-center text-muted-foreground">
            Sign in to manage your contacts
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
        />
      </Card>
    </div>
  );
};