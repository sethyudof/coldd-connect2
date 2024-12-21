export interface VCardContact {
  name?: string;
  email?: string;
  phone?: string;
}

export const parseVCF = async (file: File): Promise<VCardContact> => {
  const text = await file.text();
  const contact: VCardContact = {};
  
  const lines = text.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    if (line.startsWith('FN:')) {
      contact.name = line.substring(3).trim();
    } else if (line.startsWith('EMAIL:')) {
      contact.email = line.substring(6).trim();
    } else if (line.startsWith('TEL:')) {
      contact.phone = line.substring(4).trim();
    }
  }
  
  console.log('Parsed VCF contact:', contact);
  return contact;
};