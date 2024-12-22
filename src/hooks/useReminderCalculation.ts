import { addDays, addWeeks, addMonths, addYears, differenceInMilliseconds } from "date-fns";

interface ReminderData {
  startDate?: Date;
  reminderInterval?: number;
  reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
}

export const useReminderCalculation = (contact: ReminderData) => {
  const calculateProgress = () => {
    console.log("Calculating progress for contact");
    console.log("Start date:", contact.startDate);
    console.log("Reminder interval:", contact.reminderInterval);
    console.log("Reminder unit:", contact.reminderUnit);
    
    if (!contact.startDate || !contact.reminderInterval) {
      console.log("Missing required data, returning 0");
      return 0;
    }

    const now = new Date();
    let nextDate;
    
    switch (contact.reminderUnit) {
      case 'days':
        nextDate = addDays(new Date(contact.startDate), contact.reminderInterval);
        break;
      case 'weeks':
        nextDate = addWeeks(new Date(contact.startDate), contact.reminderInterval);
        break;
      case 'years':
        nextDate = addYears(new Date(contact.startDate), contact.reminderInterval);
        break;
      case 'months':
      default:
        nextDate = addMonths(new Date(contact.startDate), contact.reminderInterval);
    }

    const totalDuration = differenceInMilliseconds(nextDate, new Date(contact.startDate));
    const elapsed = differenceInMilliseconds(now, new Date(contact.startDate));
    
    const progress = (elapsed / totalDuration) * 100;
    console.log("Total duration:", totalDuration);
    console.log("Elapsed time:", elapsed);
    console.log("Calculated progress:", progress);
    
    return Math.min(Math.max(progress, 0), 100);
  };

  return { calculateProgress };
};