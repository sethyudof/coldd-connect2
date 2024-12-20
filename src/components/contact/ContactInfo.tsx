import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

interface ContactInfoProps {
  name: string;
  image?: string;
  email?: string;
  phone?: string;
}

export const ContactInfo = ({ name, image, email, phone }: ContactInfoProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-start gap-3">
      <Avatar>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        {(email || phone) && (
          <div className="mt-1 space-y-1">
            {email && (
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-3 h-3 mr-1" />
                {email}
              </div>
            )}
            {phone && (
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-3 h-3 mr-1" />
                {phone}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};