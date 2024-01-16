import { FAVOURITE_LIMIT } from '/constants/app_constants';
import { createModalErrorInfo } from '/utils/utils';
import { meterNameValidator, meterNoValidator } from '/utils/validator';

const app = getApp();

Page({
  data: {
    meterName: '',
    isLoading: false,
    isMeterNameValid: false,
    isMeterNoValid: false,
  },
  onLoad(query) {
    this.setData({ meterNo:  query.meterNo || '', hasRetrievedVoucher: query.hasVoucher || false, i18n: app.i18n });
  },
  onShow() {},

  // Methods
  handleInputChange(e) {
    this.setData({ [e.target.dataset.field]: e.detail.value });
  },

  meterNameValidator(e) {
    let { meterName, i18n } = this.data;

    let result = meterNameValidator(meterName, i18n);

    // If did pass the validation and has at least 3 character
    if (result === null && meterName.trim().length >= 3) {
      // Find a favourite with same meter name based on the user's favourites
      let foundFavourite = app.favouriteMeters.find(meter => meter.name.toLowerCase() === meterName.toLowerCase());

      // If found a favourite with same meter name
      if (foundFavourite) {
        result = i18n.error.meterNameAlreadyExist;
        this.setData({ isMeterNameValid: false });
      } else {
        this.setData({ isMeterNameValid: true });
      }
    } else {
      this.setData({ isMeterNameValid: false });
    }

    return result;
  },
  meterNoValidator(e) {
    let { meterNo, i18n } = this.data;

    let result = meterNoValidator(meterNo, i18n);

    // If did pass the validation and has 11 digits
    if (result === null && meterNo.length === 11) {
      // Find a favourite with same meter number based on the user's favourites
      let foundFavourite = app.favouriteMeters.find(meter => meter.reference === meterNo);

      // If found a favourite with same meter number
      if (foundFavourite) {
        result = i18n.error.meterNoAlreadyExist;
        this.setData({ isMeterNoValid: false });
      } else {
        this.setData({ isMeterNoValid: true });
      }
    } else {
      this.setData({ isMeterNoValid: false });
    }

    return result;
  },

  onCancel(e) {
    my.reLaunch({url: '/pages/index/index'});
  },
  async onSave(e) {
    // If has the limit number of favourite meters
    if (app.favouriteMeters.length >= FAVOURITE_LIMIT) {
      let i18nAlertsFavouriteLimit = this.data.i18n.alerts.favouriteLimit;
      this.errorModal.open({
        ...createModalErrorInfo(this.data.i18n),
        title: i18nAlertsFavouriteLimit.title,
        description: i18nAlertsFavouriteLimit.body1,
        primaryBtnLabel: i18nAlertsFavouriteLimit.primaryBtn,
        primaryBtnOnTap: this.onConfirmReplace.bind(this),
      });
    } else {
      // Close Alert if opened
      this.setData({ isLoading: true });

      const newMeter = {
        name: this.data.meterName.trim(),
        reference: this.data.meterNo,
      };
      
      //my.showLoading();

      try {
        await app.addFavouriteMeter(newMeter);

        const favouriteMeters = [...app.favouriteMeters].concat([newMeter]).sort((a, b) => a.name.localeCompare(b.name));

        app.favouriteMeters = favouriteMeters;
        app.setToastProps(this.data.i18n.addFavourite.favouriteAddSuccess, 'success');
        my.reLaunch({url: '/pages/index/index'});
        
      } catch (err) {
        app.setToastProps(this.data.i18n.addFavourite.favouriteAddError, 'warning');
        my.reLaunch({url: '/pages/index/index'});
      } finally {
        //my.hideLoading();
        this.setData({ isLoading: false });
      }
    }
  },
  onConfirmReplace() {
    const { meterName, meterNo } = this.data;
    this.errorModal.close();
    my.navigateTo({ url: `/pages/replace-favourite/replace-favourite?meterName=${meterName || ""}&meterNo=${meterNo || ""}&fromPay=true` });
  },
  errorModalRef(ref) {
    this.errorModal = ref;
  },
});
