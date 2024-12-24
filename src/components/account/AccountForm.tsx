import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }
        
        if (profile) {
          console.log("Profile found:", profile);
          setPhone(profile.phone_number || "");
          setSmsEnabled(profile.phone_verified || false);
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

  const handleUpdateEmail = async () => {
    try {
      console.log("Updating email to:", email);
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        console.error("Error updating email:", error);
        throw error;
      }
      toast({
        title: "Email updated",
        description: "Please check your new email for a confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating email",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyPhone = async () => {
    if (!phone) return;

    setIsVerifying(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      console.log("Initiating phone verification for:", phone);
      const response = await supabase.functions.invoke('verify-phone', {
        body: { phone },
      });

      if (response.error) throw new Error(response.error.message);

      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      });

      const code = prompt("Please enter the verification code sent to your phone:");
      if (!code) return;

      console.log("Verifying phone code...");
      const verifyResponse = await supabase.functions.invoke('verify-phone-code', {
        body: { phone, code },
      });

      if (verifyResponse.error) throw new Error(verifyResponse.error.message);

      console.log("Updating profile with verified phone...");
      await supabase
        .from('profiles')
        .update({
          phone_number: phone,
          phone_verified: true,
        })
        .eq('id', user.id);

      setSmsEnabled(true);
      toast({
        title: "Phone verified",
        description: "Your phone number has been verified successfully.",
      });
      
      // Reload profile data after successful verification
      await loadUserProfile();
    } catch (error: any) {
      console.error("Error in phone verification:", error);
      toast({
        title: "Error verifying phone",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Button onClick={handleUpdateEmail}>Update</Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="+1234567890"
          />
          <Button 
            onClick={handleVerifyPhone}
            disabled={isVerifying || !phone || smsEnabled}
          >
            {smsEnabled ? "Verified" : "Verify"}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="sms-notifications"
          checked={smsEnabled}
          disabled={!smsEnabled}
        />
        <Label htmlFor="sms-notifications">Enable SMS notifications</Label>
      </div>
    </div>
  );
};