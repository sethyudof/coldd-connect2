import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BrandLogo } from "@/components/common/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { TrialFeatures } from "./TrialFeatures";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export const AuthLayout = () => {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_up');
  useAuthRedirect();

  const handleViewChange = (newView: 'sign_in' | 'sign_up') => {
    console.log("Changing view to:", newView);
    setView(newView);
  };

  const handleError = (error: any) => {
    console.error("Auth error:", error);
    const errorMessage = error.message || error.error_description || "An unexpected error occurred";
    
    if (errorMessage.includes('User already registered') || errorMessage.includes('user_already_exists')) {
      console.log("User already exists, switching to sign in view");
      toast.error("Account Already Exists", {
        description: "Please sign in with your existing account",
        duration: 5000,
      });
      setView('sign_in');
    } else {
      console.error("Unexpected auth error:", error);
      toast.error("Authentication Error", {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <div className="flex justify-center mb-2">
            <BrandLogo />
          </div>
          {view === 'sign_up' && <TrialFeatures />}
        </div>
        <Auth
          supabaseClient={supabase}
          view={view}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                },
              },
            },
            style: {
              button: {
                fontSize: '14px',
                padding: '10px 15px',
              },
            },
            className: {
              button: 'custom-button',
            },
          }}
          localization={{
            variables: {
              sign_up: {
                button_label: 'Start free trial'
              }
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
          magicLink={false}
          showLinks={true}
          onViewChange={handleViewChange}
          onError={handleError}
        />
      </Card>
    </div>
  );
};