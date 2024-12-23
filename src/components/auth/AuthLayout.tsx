import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BrandLogo } from "@/components/common/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { TrialFeatures } from "./TrialFeatures";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { AuthForm } from "./AuthForm";

export const AuthLayout = () => {
  const [currentView, setCurrentView] = useState<'sign_in' | 'sign_up'>('sign_in');
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
        toast.error("Authentication Error", {
          description: "Please sign in again",
          duration: 5000,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleViewChange = (view: 'sign_in' | 'sign_up') => {
    console.log("View changed to:", view);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <div className="flex justify-center mb-2">
            <BrandLogo />
          </div>
          {currentView === 'sign_up' && <TrialFeatures />}
        </div>
        <AuthForm 
          view={currentView}
          onViewChange={handleViewChange}
        />
      </Card>
    </div>
  );
};