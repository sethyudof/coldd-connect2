import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhoneSectionProps {
  initialPhone: string;
  initialSmsEnabled: boolean;
  onVerificationComplete: () => Promise<void>;
}

export const PhoneSection = ({ 
  initialPhone, 
  initialSmsEnabled,
  onVerificationComplete 
}: PhoneSectionProps) => {
  const [phone, setPhone] = useState(initialPhone);
  const [smsEnabled, setSmsEnabled] = useState(initialSmsEnabled);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

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
      
      await onVerificationComplete();
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
    <>
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
    </>
  );
};