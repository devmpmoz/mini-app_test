/**
 * Format number
 * @param number {Number} number to be formatted
 * @param fractionDigits {number} 
 * @example
 * format(450.70)
 */
function format(number, fractionDigits = 2) {
  // If is not a Number object
  number = parseFloat(number);

  let options = { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits };

  let formattedNumber = number.toLocaleString('en-US', options);

  return formattedNumber === 'NaN' ? 'N/I' : formattedNumber;
}

function currency(number, fractionDigits = 2, noAmountKey) {
  let result = format(number, fractionDigits);
  return result === 'N/I' ? (noAmountKey || 'N/I') : result + ' MT';
}

export default { format, currency }