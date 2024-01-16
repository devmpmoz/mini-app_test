import { MINIMUM_AMOUNT, MAXIMUM_AMOUNT, MAXIMUM_AMOUNT_LABEL } from '/constants/app_constants';

/**
 * Validate meter name
 * 
 * It returns error message if it is not complaint otherwise it returns null.
 * @param meterName {string} meter name value
 * @param i18n {Object} internationalization map object
 * @example
 * meterNameValidator('Mom House', i18n)
 */
const meterNameValidator = function (meterName, i18n) {
  if (meterName === '') {
    return null;
  }

  // Regular expression pattern to validate a string with alphanumeric and with length between 0 and 20
  // NOTE: 0 character as minimum just to not display error when start typing yet was the validation event is on-type event.
  let pattern = /^[A-Za-z0-9\s]{0,20}$/;

  const regex = new RegExp(pattern);

  // Test the meterName against the regular expression
  const isValid = regex.test(meterName);

  if (!isValid) {
    return i18n.error.invalidMeterName;
  }

  return null;
};

/**
 * Validate meter number
 * 
 * It returns error message if it is not complaint otherwise it returns null.
 * @param meterNo {string} meter number value
 * @param i18n {Object} internationalization map object
 * @example
 * meterNoValidate('2348758093723', i18n)
 */
const meterNoValidator = function (meterNo, i18n) {
  if (meterNo === '') {
    return null;
  }

  // Regular expression pattern to check only digits
  let pattern = /^\d+$/;

  const regex = new RegExp(pattern);

  // Test the meterNo against the regular expression
  const isValid = regex.test(meterNo);

  if (!isValid) {
    return i18n.error.invalidMeterNumber;
  }

  if (meterNo.length < 11) {
    return i18n.error.incompleteMeterNumber;
  }

  if (meterNo.length > 11) {
    return i18n.error.invalidMeterNumber;
  }

  return null;
};

/**
 * Validate amount
 * 
 * It returns error message if it is not complaint otherwise it returns null.
 * @param amount {string} amount value
 * @param i18n {Object} internationalization map object
 * @example
 * amountValidator(50, i18n)
 */
const amountValidator = function (amount, i18n) {
  if (amount === '') {
    return null;
  }

  // Check if is a Number
  if (isNaN(amount) || (amount && amount.toString().includes(',')) || (amount && amount.toString().split('.').length>1 && amount.toString().split('.')[1].length > 2)) {
    return i18n.error.invalidAmount;
  }

  // Check if the amount is not below the Minimum amount
  if (Number.parseFloat(amount) < MINIMUM_AMOUNT) {
    return i18n.error.minimumAmount + MINIMUM_AMOUNT + ' MT';
  } else if(Number.parseFloat(amount) > MAXIMUM_AMOUNT){
    return i18n.error.maximumAmount + MAXIMUM_AMOUNT_LABEL + ' MT';
  }
  
  return null;
};


export { meterNameValidator, meterNoValidator, amountValidator }