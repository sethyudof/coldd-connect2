import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmailSection } from "./email/EmailSection";
import { PhoneSection } from "./phone/PhoneSection";

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AccountForm mounted, loading user profile...");
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      console.log("Fetching user data...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }

      if (user) {
        console.log("User found, setting email:", user.email);
        setEmail(user.email || "");
        
        console.log("Fetching profile data for user:", user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number, phone_verified')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }
        
        if (profile) {
          console.log("Profile found:", profile);
          setPhone(profile.phone_number || "");
          setSmsEnabled(profile.phone_verified || false);
        } else {
          console.log("No profile found for user");
          setPhone("");
          setSmsEnabled(false);
        }
      }
    } catch (error: any) {
      console.error("Error in loadUserProfile:", error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <EmailSection initialEmail={email} />
      <PhoneSection 
        initialPhone={phone}
        initialSmsEnabled={smsEnabled}
        onVerificationComplete={loadUserProfile}
      />
    </div>
  );
};