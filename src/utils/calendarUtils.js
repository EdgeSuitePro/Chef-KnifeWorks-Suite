import { addMinutes, parse, format } from 'date-fns';

export const generateGoogleCalendarUrl = (reservation) => {
  try {
    // Expects dropOffDate like "Friday, November 24th" and time like "10:00 AM" or "10:00AM ~ 10:30AM"
    // We use selectedDate (YYYY-MM-DD) if available for date.
    
    const dateStr = reservation.selectedDate || new Date().toISOString().split('T')[0];
    
    // Handle time range like "8:00AM ~ 8:30AM" by taking the start time
    let timeStr = reservation.selectedSlot || '12:00 PM';
    if (timeStr.includes('~')) {
        timeStr = timeStr.split('~')[0].trim();
    }

    const dateTimeStr = `${dateStr} ${timeStr}`;
    // Parse using format that matches our ReservationForm output (h:mma)
    // If timeStr has space (e.g. "12:00 PM"), use 'h:mm a', if "8:00AM", use 'h:mma'
    const timeFormat = timeStr.includes(' ') ? 'h:mm a' : 'h:mma';
    
    const startDate = parse(dateTimeStr, `yyyy-MM-dd ${timeFormat}`, new Date());
    const endDate = addMinutes(startDate, 30); // 30 min slot

    const start = format(startDate, "yyyyMMdd'T'HHmmss");
    const end = format(endDate, "yyyyMMdd'T'HHmmss");

    const title = encodeURIComponent("Knife Drop-Off: Chef KnifeWorks");
    const details = encodeURIComponent(`Reservation ID: ${reservation.id}\nQuantity: ${reservation.knifeQty}\n\nPlease arrive during this window to use the secure DropBox.`);
    const location = encodeURIComponent("13969 88th Place North, Maple Grove, MN 55369");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  } catch (e) {
    console.error("Error generating calendar link", e);
    return "https://calendar.google.com/";
  }
};