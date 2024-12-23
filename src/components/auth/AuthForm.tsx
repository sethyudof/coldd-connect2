import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  view: 'sign_in' | 'sign_up';
  onViewChange: (view: 'sign_in' | 'sign_up') => void;
}

export const AuthForm = ({ view, onViewChange }: AuthFormProps) => {
  console.log("Rendering AuthForm with view:", view);
  
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
    />
  );
};