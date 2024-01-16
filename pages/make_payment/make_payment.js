import { PAYMENT_AMOUNT_OPTIONS, SHORTCODE } from '/constants/app_constants.js';
import { meterNoValidator, amountValidator } from '/utils/validator';

const app = getApp();

Page({
  data: {
    meterName: '',
    meterNo: '',
    amount: '',
    isValid: false,
    isLoading: false,
    isNewMeter: true,
    isMeterNoValid: false,
    isAmountValid: false,
    amountOptions: PAYMENT_AMOUNT_OPTIONS,
    isLoading: false
  },
  onLoad(query) {
    // TODO: Load cached PIN
    let { meterName, meterNo, amount } = query;
    
    if (meterName && meterNo) {
      this.setData({ meterName:  meterName, meterNo: meterNo, meterWasFavourite: app.favouriteMeters.find(meter => meter.reference === meterNo), amount: amount || '', isNewMeter: false });
    } else if (meterNo) {
      this.setData({ meterNo: meterNo, meterWasFavourite: app.favouriteMeters.find(meter => meter.reference === meterNo), amount: amount || '', isNewMeter: false });
    } else if(app.navigateBackPayload) {
      this.setData({ meterName:  app.navigateBackPayload.meterName, meterNo: app.navigateBackPayload.meterNo, meterWasFavourite: app.favouriteMeters.find(meter => meter.reference === app.navigateBackPayload.reference), amount: app.navigateBackPayload.amount || '', isNewMeter: false });
      app.navigateBackPayload=null;
    }
    this.setData({ i18n: app.i18n });

    // Pre-validate meter number
    this.meterNoValidator();
    
    // Pre-validate amount
    this.amountValidator();
  },

  onShow(){
    if(app.navigateBackPayload) {
      this.setData({ meterName:  app.navigateBackPayload.name, meterNo: app.navigateBackPayload.reference, meterWasFavourite: app.favouriteMeters.find(meter => meter.reference === app.navigateBackPayload.reference), isNewMeter: false });
      app.navigateBackPayload=null;
      // Pre-validate meter number
      this.meterNoValidator();
    
      // Pre-validate amount
      this.amountValidator();
    }
  },

  // Methods
  handleInputChange(e) {
    this.setData({ [e.target.dataset.field]: e.detail.value });
    if(e.target.dataset.field == 'meterNo'){
      this.setData({ meterName: '' });
    }
  },
  async onContinue(e) {
    // Close modal if visible
    this.setData({ isLoading: true });

    let { meterName, meterNo, amount } = this.data;

    try {
      const res = await app.fetchPreValidation(amount, SHORTCODE, meterNo);
         
      const chargeAmount = res.charge_amount;
      my.navigateTo({ url: `/pages/confirm-payment/confirm-payment?meterName=${meterName || ""}&meterNo=${meterNo || ""}&amount=${amount}&chargeAmount=${chargeAmount}` });
    } catch (err) {
      my.navigateTo({ url: `/pages/confirm-payment/confirm-payment?meterName=${meterName || ""}&meterNo=${meterNo || ""}&amount=${amount}&chargeAmount=""` });
    } finally {
      this.setData({ isLoading: false });
    }
  },
  onSelectFavourite(e) {
    let { meterName, meterNo, amount } = this.data;
    my.navigateTo({ url: `/pages/favourites/favourites?selectFav=true&meterName=${meterName || ""}&meterNo=${meterNo || ""}` });
  },
  onSelectAmount(e) {
    this.setData({ amount: e.target.dataset.value });

    this.amountValidator(e);
  },
  meterNoValidator(e) {
    let { meterNo, i18n } = this.data;
    let result = meterNoValidator(meterNo, i18n);
    // If did pass the validation and has 11 digits
    if (result === null && meterNo.length === 11) {
      this.setData({ isMeterNoValid: true });
    } else {
      this.setData({ isMeterNoValid: false });
    }

    return result;
  },
  amountValidator(e) {
    let { amount, i18n } = this.data;

    let result = amountValidator(amount, i18n);

    // If did pass the validation and is a valid amount 
    if (result === null && Number.parseFloat(amount)) {
      this.setData({ isAmountValid: true });
    } else {
      this.setData({ isAmountValid: false });
    }

    return result;
  },
});
