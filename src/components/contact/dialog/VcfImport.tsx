import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { parseVCF } from "@/utils/vcfParser";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VcfImportProps {
  onSuccess: () => void;
}

export const VcfImport = ({ onSuccess }: VcfImportProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Processing VCF file:', file.name);
      const vcfContacts = await parseVCF(file);
      
      if (vcfContacts.length > 0) {
        for (const contact of vcfContacts) {
          if (contact.name) {
            const { error } = await supabase
              .from('contacts')
              .insert([{
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
              }]);

            if (error) {
              console.error('Error adding contact:', error);
            }
          }
        }

        onSuccess();
        toast({
          title: "Contacts imported",
          description: `${vcfContacts.length} contacts successfully imported`,
        });
      } else {
        toast({
          title: "Import failed",
          description: "Could not find contact information in the VCF file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing VCF file:', error);
      toast({
        title: "Import failed",
        description: "Error processing VCF file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="vcf-upload">Import VCF File (Optional)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="vcf-upload"
          type="file"
          accept=".vcf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('vcf-upload')?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload VCF File
        </Button>
      </div>
    </div>
  );
};