import en from '/i18n/en';
import pt from '/i18n/pt';
import { DEFAULT_LANGUAGE } from '/constants/app_constants';

const app = getApp();

/**
* Load language code translation dictionary
* @param languageCode {String} Language code eg. pt, en...
* @example
* loadLanguage(languageCode)
*/
function loadLanguage(lang) {
  let langDictionary, languageCode = lang.toLowerCase();

  switch (languageCode) {
    case 'pt':
      langDictionary = pt;
      break;
    
    case 'en':
      langDictionary = en;
      break;
  
    default:
      languageCode = DEFAULT_LANGUAGE;
      langDictionary = pt;
      break;
    
  }
  app.setLanguage(languageCode, langDictionary);
}

export { loadLanguage }