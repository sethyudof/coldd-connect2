import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

export const AuthLayout = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_up');

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    console.log("Checking auth state...");
    supabase.auth.getSession().then(({ data: { session }}) => {
      console.log("Current session:", session);
      if (session) {
        console.log("User already logged in, redirecting to home...");
        navigate("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in, redirecting to home...");
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleViewChange = (newView: 'sign_in' | 'sign_up') => {
    console.log("Changing view to:", newView);
    setView(newView);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <div className="flex justify-center mb-2">
            <BrandLogo />
          </div>
          {view === 'sign_up' && (
            <>
              <p className="text-center text-muted-foreground mb-6">
                Start your 7-day free trial today
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Unlimited contacts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Smart reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Contact categorization</span>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground mb-6">
                Plans start at $3.99/month after trial
              </div>
            </>
          )}
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
          {...{
            emailPasswordlessEnabled: false,
            magicLinkEnabled: false,
            onViewChange: handleViewChange,
            emailPassword: {
              onError: (error: any) => {
                console.error("Auth error:", error);
                if (error.message?.includes('User already registered')) {
                  console.log("User already exists, switching to sign in view");
                  toast.error("Account Already Exists", {
                    description: "Please sign in with your existing account",
                  });
                  setView('sign_in');
                } else {
                  console.error("Unexpected auth error:", error);
                  toast.error("Authentication Error", {
                    description: error.message || "An unexpected error occurred during authentication"
                  });
                }
              }
            }
          }}
        />
      </Card>
    </div>
  );
};