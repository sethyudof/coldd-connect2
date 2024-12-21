export interface VCardContact {
  name?: string;
  email?: string;
  phone?: string;
}

export const parseVCF = async (file: File): Promise<VCardContact[]> => {
  const text = await file.text();
  const contacts: VCardContact[] = [];
  let currentContact: VCardContact = {};
  
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Start a new contact
    if (line === 'BEGIN:VCARD') {
      currentContact = {};
      continue;
    }
    
    // End current contact and add to list
    if (line === 'END:VCARD') {
      if (Object.keys(currentContact).length > 0) {
        contacts.push(currentContact);
      }
      continue;
    }
    
    // Handle folded lines (lines that continue with whitespace)
    while (i + 1 < lines.length && lines[i + 1].match(/^\s/)) {
      line += lines[i + 1].trim();
      i++;
    }
    
    // Parse contact fields
    if (line.startsWith('FN:')) {
      currentContact.name = line.substring(3).trim();
    } else if (line.startsWith('N:')) {
      // If no FN, construct from N
      const nameParts = line.substring(2).split(';');
      if (!currentContact.name && nameParts.length > 1) {
        currentContact.name = `${nameParts[1].trim()} ${nameParts[0].trim()}`.trim();
      }
    } else if (line.startsWith('EMAIL')) {
      const email = line.split(':')[1]?.trim();
      if (email) currentContact.email = email;
    } else if (line.startsWith('TEL')) {
      const phone = line.split(':')[1]?.trim();
      if (phone) currentContact.phone = phone;
    }
  }
  
  // Add the last contact if it exists
  if (Object.keys(currentContact).length > 0 && !contacts.includes(currentContact)) {
    contacts.push(currentContact);
  }
  
  console.log('Parsed VCF contacts:', contacts);
  return contacts;
};