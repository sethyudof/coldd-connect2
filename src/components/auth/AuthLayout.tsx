import { useState, useEffect } from "react";
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      } else if (event === 'USER_DELETED') {
        console.log("User deleted");
      }

      // Handle specific error cases
      if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        toast.error("Authentication Error", {
          description: "Please sign in again",
          duration: 5000,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        />
      </Card>
    </div>
  );
};