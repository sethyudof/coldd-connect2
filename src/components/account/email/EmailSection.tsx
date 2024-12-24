import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EmailSection = ({ initialEmail }: { initialEmail: string }) => {
  const [email, setEmail] = useState(initialEmail);
  const { toast } = useToast();

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

  return (
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
  );
};