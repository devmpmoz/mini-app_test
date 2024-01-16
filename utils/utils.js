import { $sjs_currency } from './formatNumber.sjs';
import { APP_ERRORS } from '/constants/app_constants';

/**
 * Groups the values in an array, based on a provided compare function.
 * @param {Array} values The values to be analised and grouped. As the array will be iterated,
 * the values in it should be sorted by the property that will be used to group them.
 * @param {Function} groupFn The function that will be used to group the values in the array.
 * It should received two parameters, which are two subsequent elements from the array.
 * It should return true if the second parameter/value belongs to the same group as the first
 * parameter/value.
 * @returns An array containing the created groups. Each group is itself an array of the elements
 * provided in the 'values' property.
 */
export const groupArrayValues = (values, groupFn) => {

  const result = [];

  let lastValue;
  let group = [];
  
  values.map((value) => {

    if (!lastValue) {
      group.push(value);
    } else {
      const isSameGroup = groupFn(value, lastValue);

      if (!isSameGroup) {
        result.push(group);
        group = [];
      }
      group.push(value);
    }

    lastValue = value;
  });

  if (group.length > 0) {
    result.push(group);
  }

  return result;
}

/**
 * sortFavourites: Sorts the favourites by their name
 * @param {Array} list: The favourites list to be sorted 
 * @returns Array
 */
export const sortFavourites = (list) => {
  return list.sort((a, b) => a.name.localeCompare(b.name))
}

// Method to format the voucher code
export const formatToken = (token) => {
  // Remove existing spaces and non-digit characters
  const cleanedToken = token.replace(/\s+/g, '').replace(/\D/g, '');
  // Insert spaces every four characters
  const spacedInput = cleanedToken.replace(/(.{4})(?!$)/g, '$1 ');
  return spacedInput;
}

/**
 * formatValueToQueryParam: Check's if a value is defined, and if is currency checks for NaN, undefined and null
 * @param {string} param : value to be sent in query parameter
 * @param {boolean} currency : boolean identifing if it should be threated as currency value
 * @param { boolean } token: boolean identifing if it should be threated as a token
 */
export const formatValueToQueryParam = (param, currency, token) => {
  if(currency) {
    if(param === undefined || param === null || isNaN(parseFloat(param))) {
      return ''
    }
    return param
  }
  if(token) {
    return param ? formatToken(param) : ''
  }
  return param ? param : ''
}

export const createModalErrorInfo = (i18n, errorCode, cancelOperationFn) => {
  errorCode = errorCode || APP_ERRORS.UNKNOWN;
  const errorStrings = i18n.errorCodes[errorCode] || i18n.errorCodes[APP_ERRORS.UNKNOWN];
  let bothRetryAndCancelButtons = true;

  const errorInfo = {
    title: errorStrings.title,
    description: errorStrings.description,
    primaryBtnLabel: errorStrings.primaryButton,
    secondaryBtnLabel: errorStrings.secondaryButton,
  };
  
  switch (errorCode) {
    case APP_ERRORS.AMOUNT_TOO_LOW:
    case APP_ERRORS.AMOUNT_TOO_HIGH:
      errorInfo.image = '/assets/icons/si_no_balance.svg';
      break;
    case APP_ERRORS.LIMIT_EXCEEDED:
    case APP_ERRORS.INSUFFICIENT_BALANCE:
      bothRetryAndCancelButtons = false;
      errorInfo.image = '/assets/icons/si_no_balance.svg';
      break;
    case APP_ERRORS.INVALID_RECEIVER:
    case APP_ERRORS.INVALID_PARAMETERS:
    case APP_ERRORS.WRONG_PIN:
    case APP_ERRORS.SERVICE_UNAVAILABLE:
      errorInfo.image = '/assets/icons/service_unavailable.svg';
      break;
    default:
      errorInfo.image = '/assets/icons/hi_warning.svg';
      break;
  }

  if (cancelOperationFn) {
    if (bothRetryAndCancelButtons) {
      errorInfo.secondaryBtnOnTap = cancelOperationFn;
    } else {
      errorInfo.primaryBtnOnTap = cancelOperationFn;
    }
  }

  return errorInfo;
}

export const formatCurrency = $sjs_currency;
