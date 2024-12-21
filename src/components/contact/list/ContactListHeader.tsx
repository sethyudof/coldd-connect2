import { TableHead, TableRow } from "@/components/ui/table";

export const ContactListHeader = () => {
  return (
    <TableRow>
      <TableHead>Contact Details</TableHead>
      <TableHead>Categories</TableHead>
      <TableHead>Reminder</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  );
};