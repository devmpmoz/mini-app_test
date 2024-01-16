import { 
  DEFAULT_LANGUAGE, 
  EXTERNAL_API, 
  EXTERNAL_API_PAYMENT, 
  SHORTCODE, 
  API_ERROR_CODES_MAPPING, 
  APP_ERRORS 
} from '/constants/app_constants';
// import payments from '/data/payments';
// import favouriteMeters from '/data/favouriteMeters'
import pt from '/i18n/pt';

const API_STATUS = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
})

App({
  // Events
  onLaunch() {
    // options.query == {number:1}
  },
  onShow() {},
  // Global data
  globalData: {
    shortcode: SHORTCODE,
    staticAssets: {
      icons: '/assets/images/icons',
      illustrations: '/assets/images/illustrations',
      logos: '/assets/images/logos'
    },
    navigateToPayload: null,
    navigateBackPayload: null,
  },
  payments: [],
  favouriteMeters: [],
  showToast: false,
  toastContent: "",
  toastType: 'success',
  languageCode: DEFAULT_LANGUAGE, // Default Language Code
  i18n: pt,
  
  // Global method
  setPayments(payments) {
    this.payments = payments;
  },
  setFavouriteMeters(favouriteMeters) {
    this.favouriteMeters = favouriteMeters;
  },
  setLanguage(languageCode, i18n) {
    this.languageCode = languageCode;
    this.i18n         = i18n;
  },
  /// Retrieve user's beneficiaries
  fetchFavouriteMeters() {
    let data = {
      "command": "LIST_BEN",
      "service_channel": "MINI_APP",
      "user": "${MSISDN}",
      "shortcode": SHORTCODE
    };

    let proxyData = {
      msisdn: "msisdn",
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: false,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          payload: JSON.stringify(data)
        }
      }
    };

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn"],
        configOptions: '{}',
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API,
        success: function(res) {
          const data = res.proxiedResponse.data;
          // Protect data content when it's not json like
         try {
            const content = JSON.parse(data.content);
            const { response_code, response_desc } = content;
  
            if (response_code == 0) {
              console.log(content);
              resolve(content.beneficiaries);
            } else {
              console.log(res);
              const errorCode = API_ERROR_CODES_MAPPING[response_code] || APP_ERRORS.UNKNOWN;
              reject({errorCode, error: response_code, errorMessage: response_desc});
            }
          } catch (e) {
            console.log('Request timeout')
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function(err) {
          console.log(err);
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },
  /// Create user's beneficiary
  addFavouriteMeter(meter) {
    let data = {
      command: "CREATE_BEN",
      service_channel: "MINI_APP",
      user: "${MSISDN}",
      shortcode: SHORTCODE,
      beneficiary_name: `${meter.name}`,
      beneficiary_reference: `${meter.reference}`
    };

    let proxyData = {
      msisdn: "msisdn",
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: false,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          payload: JSON.stringify(data)
        }
      }
    };

    const loadingText = this.i18n.addFavourite.addFavouriteLoading;

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn"],
        configOptions: `{"loader": {"text": "${loadingText}"}}`,
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API,
        success: function(res) {
          const data = res.proxiedResponse.data;
          try {
            const content = JSON.parse(data.content); 
            const { response_code, response_desc } = content;
            console.log(content)
            if (response_code == 0) {
              resolve(true);
            } else {
              const errorCode = API_ERROR_CODES_MAPPING[response_code] || APP_ERRORS.UNKNOWN;
              reject({errorCode, error: response_code, errorMessage: response_desc});
            }
          } catch (e) {
            console.log('Request timeout')
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function() {
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },
  /// Update user's beneficiary
  updateFavouriteMeter(oldMeter, newMeter, isReplace = false) {
    let data = {
      command: "UPDATE_BEN",
      service_channel: "MINI_APP",
      user: "${MSISDN}",
      shortcode: SHORTCODE,
      beneficiary_name: `${oldMeter.name}`,
      beneficiary_reference: `${oldMeter.reference}`,
      new_beneficiary_reference: `${newMeter.reference}`,
      new_beneficiary_name: `${newMeter.name}`,
      update_option: "0",
    };

    let proxyData = {
      msisdn: "msisdn",
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: false,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          payload: JSON.stringify(data)
        }
      }
    };

    const loadingText = isReplace ? this.i18n.replaceFavourite.replaceFavouriteLoading : this.i18n.editFavourite.editFavouriteLoading;

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn"],
        configOptions: `{"loader": {"text": "${loadingText}"}}`,
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API,
        success: function(res) {
          const data = res.proxiedResponse.data;          
          try {
            const content = JSON.parse(data.content);
            const { response_code, response_desc } = content;
            console.log(content)
            if (response_code == 0) {
              resolve(true);
            } else {
              const errorCode = API_ERROR_CODES_MAPPING[response_code] || APP_ERRORS.UNKNOWN;
              reject(errorCode, {error: response_code, errorMessage: response_desc});
            }
          } catch(e) {
            console.log('Request timeout')
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function(err) {
          console.log(err);
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },
  deleteFavouriteMeter(meter) {
    let data = {
      command: "DELETE_BEN",
      service_channel: "MINI_APP",
      user: "${MSISDN}",
      shortcode: SHORTCODE,
      beneficiary_name: `${meter.name}`,
      beneficiary_reference: `${meter.reference}`
    };

    let proxyData = {
      msisdn: "msisdn",
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: false,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          payload: JSON.stringify(data)
        }
      }
    };

    const loadingText = this.i18n.favourites.removeFavouriteLoading;

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn"],
        configOptions: `{"loader": {"text": "${loadingText}"}}`,
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API,
        success: function(res) {
          const data = res.proxiedResponse.data;
          try {
            const content = JSON.parse(data.content);
            const { response_code, response_desc } = content;
            console.log(content)
            if (response_code == 0) {              
              resolve(true);
            } else {
              const errorCode = API_ERROR_CODES_MAPPING[response_code] || APP_ERRORS.UNKNOWN;
              reject({errorCode, error: response_code, errorMessage: response_desc});
            }
          } catch(e) {
            console.log('Request timeout')
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function(err) {
          console.log(err);
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },
  buyCredelec(meterNo, amount) {
    let data = {
      miniApp: "CREDELEC",
      phoneNumber: "${MSISDN}",
      data:{
        referenceNumber: `${meterNo}`,
        amount: amount,
        shortcode: SHORTCODE
      }
    };

    let proxyData = {
      msisdn: "msisdn",
      pin: {
        algorithm: "RSA",
        data: "pin"
      },
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: true,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "pt"
          },
          payload: JSON.stringify(data)
        }
      }
    };

    const loadingText = this.i18n.makePayment.makePaymentLoading;

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn", "pin"],
        configOptions: `{"loader": {"text": "${loadingText}"}}`,
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API_PAYMENT,
        success: function(res) {
          const data = res.proxiedResponse.data;
          try {
            const content = JSON.parse(data.content);
            console.log(content)
            if(content.status === API_STATUS.SUCCESS) {
              resolve(content.data);
            } else {
              const error = content.data && content.data.errorCode;
              const errorMessage = content.data && content.data.message;
              const errorCode = API_ERROR_CODES_MAPPING[error] || APP_ERRORS.UNKNOWN;
              reject({errorCode, error, errorMessage});
            }
          } catch(e) {
            console.log('Request timeout')
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function(err) {
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },
  
  fetchPaymentsHistory(page) {
    let data = {
      command: "LIST_TRAN",
      service_channel: "MINI_APP",
      user: "${MSISDN}",
      shortcode: SHORTCODE,
      page: page
    };

    let proxyData = {
      msisdn: "msisdn",
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: false,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          payload: JSON.stringify(data)
        }
      }
    };

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn"],
        configOptions: '{}',
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API,
        success: function(res) {
          const data = res.proxiedResponse.data;
          try {
            const content = JSON.parse(data.content);
            const { response_code, response_desc } = content;
            console.log(content)
            if (response_code == 0) {
              resolve(content.data);
            } else {
              const errorCode = API_ERROR_CODES_MAPPING[response_code] || APP_ERRORS.UNKNOWN;
              reject({errorCode, error: response_code, errorMessage: response_desc});
            }
          } catch (err) {
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function(err) {
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },

  //Pre validation request
  fetchPreValidation(amount, shortcode, meterNo) {
    let data = {
      "command": "PRE_VAL",
      "service_channel": "MINI_APP",
      "user": "${MSISDN}",
      "amount": `${amount}`,
      "shortcode": `${shortcode}`,
      "third_party_ref": `${meterNo}`
    };

    let proxyData = {
      msisdn: "msisdn",
      proxiedRequest: {
        needsIdentity: true,
        needsPIN: false,
        requestInfo: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          payload: JSON.stringify(data)
        }
      }
    };
    const loadingText = this.i18n.makePayment.preValidationLoading;

    return new Promise((resolve, reject) => {
      my.call("makeRequest", {
        replaceParams: ["msisdn"],
        configOptions: `{"loader": {"text": "${loadingText}"}}`,
        payload: JSON.stringify(proxyData),
        url: EXTERNAL_API,
        success: function(res) {
          const data = res.proxiedResponse.data;
          try {
            const content = JSON.parse(data.content);
            const { response_code, response_desc } = content;
            console.log(content);
            if (response_code == 0) {
              resolve(content.data);
            } else {
              console.log(res);
              const errorCode = API_ERROR_CODES_MAPPING[response_code] || APP_ERRORS.UNKNOWN;
              reject({errorCode, error: response_code, errorMessage: response_desc});
            }
          } catch(e) {
            console.log('Request timeout')
            reject({errorCode: APP_ERRORS.UNKNOWN});
          }
        },
        fail: function(err) {
          console.log(err);
          reject({errorCode: APP_ERRORS.UNKNOWN});
        },
      });
    });
  },
  setToastProps(text, type){
    this.toastContent = text;
    this.toastType = type;
    this.showToast = true;
  },
  resetToastProps(){
    this.toastContent = '';
    this.toastType = 'success';
    this.showToast = false;
  }
});
