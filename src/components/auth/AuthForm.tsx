import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { TrialFeatures } from "./TrialFeatures";
import { useState } from "react";

export const AuthForm = () => {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  return (
    <div className="w-full max-w-[400px] mx-auto space-y-6">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#6B46C1",
                brandAccent: "#553C9A",
              },
              radii: {
                borderRadiusButton: "8px",
                buttonBorderRadius: "8px",
                inputBorderRadius: "8px",
              },
            },
          },
          style: {
            button: {
              fontSize: "16px",
              padding: "10px 15px",
            },
            input: {
              fontSize: "16px",
            },
            anchor: {
              color: "#553C9A",
            },
          },
          className: {
            button: "font-medium",
            input: "font-normal",
          },
        }}
        view={view}
        viewChange={({ view }) => {
          console.log("View changed to:", view);
          setView(view as "sign_in" | "sign_up");
        }}
      />
      {view === "sign_up" && <TrialFeatures />}
    </div>
  );
};