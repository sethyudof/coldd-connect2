import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

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
};