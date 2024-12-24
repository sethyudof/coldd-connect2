import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EmailSection = ({ initialEmail }: { initialEmail: string }) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateEmail = async () => {
    try {
      setIsLoading(true);
      console.log("Attempting to update email to:", email);

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const { data, error } = await supabase.auth.updateUser({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error("Error updating email:", error);
        throw error;
      }

      console.log("Email update response:", data);

      toast({
        title: "Verification email sent",
        description: "Please check your new email for a confirmation link.",
      });
    } catch (error: any) {
      console.error("Error in handleUpdateEmail:", error);
      toast({
        title: "Error updating email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          placeholder="Enter your email"
          disabled={isLoading}
        />
        <Button onClick={handleUpdateEmail} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
};