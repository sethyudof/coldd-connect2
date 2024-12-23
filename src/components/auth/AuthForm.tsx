import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { AuthChangeEvent } from "@supabase/supabase-js";

interface AuthFormProps {
  view: 'sign_in' | 'sign_up';
  onViewChange: (view: 'sign_in' | 'sign_up') => void;
}

export const AuthForm = ({ view, onViewChange }: AuthFormProps) => {
  console.log("Rendering AuthForm with view:", view);
  
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'SIGNED_IN') {
        console.log("User signed in:", session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      } else {
        console.log("Auth event:", event);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Auth
      supabaseClient={supabase}
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
      view={view}
      onChange={({ view }) => {
        console.log("View changed to:", view);
        if (view === 'sign_in' || view === 'sign_up') {
          onViewChange(view);
        }
      }}
    />
  );
};