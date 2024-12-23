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
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email || "");
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number, phone_verified')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setPhone(profile.phone_number || "");
        setSmsEnabled(profile.phone_verified || false);
      }
    }
  };

  const handleUpdateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      toast({
        title: "Error updating email",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email updated",
        description: "Please check your new email for a confirmation link.",
      });
    }
  };

  const handleVerifyPhone = async () => {
    if (!phone) return;

    setIsVerifying(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
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

      const verifyResponse = await supabase.functions.invoke('verify-phone-code', {
        body: { phone, code },
      });

      if (verifyResponse.error) throw new Error(verifyResponse.error.message);

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
    } catch (error: any) {
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