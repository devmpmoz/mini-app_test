/**
 * Format date
 * 
 * Returns date
 * @param date {string} Date in string
 * @param locale {string} application current locale
 * @example
 * format('2023-03-10T00:00:00')
 */
function format(date, locale) {
  let dateObj = getDate(date);
  let options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Johannesburg' };
  
  let formattedDate = dateObj.toLocaleDateString(locale, options);
  
  return formattedDate !== 'Invalid Date' ? formattedDate : 'N/I';
}

/**
 * Format date
 * 
 * Returns date and time
 * @param date {string} Date in string
 * @param locale {string} application current locale
 * @example
 * format('2023-03-10T00:00:00')
 */
function formatDateTime(date, locale) {
  let formattedDate = format(date, locale);
  
  let dateObj = getDate(date);
  let formattedTime = dateObj.toLocaleTimeString(locale, { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  return formattedDate === 'N/I' ? 'N/I' : formattedDate + ', ' + formattedTime;
}

export default { format, formatDateTime }