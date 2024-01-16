import { FAVOURITE_LIMIT } from '/constants/app_constants';
import { createModalErrorInfo, sortFavourites } from '/utils/utils';
import { meterNameValidator, meterNoValidator } from '/utils/validator';

const app = getApp();

Page({
  data: {
    defaultTitle: 'Add favourite',
    meterName: '',
    meterNo: '',
    isLoading: false,
    isMeterNameValid: false,
    isMeterNoValid: false,
  },
  // Lifecycle Events
  onLoad(query) {
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    this.setData({ i18n: app.i18n });
  },
  onReady() {},
  onShow() {},
  // Event handler
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
  async onAdd(e) {
    //If has the limit number of favourite meters
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
      this.setData({ isLoading: true });

      const newMeter = {
        name: this.data.meterName.trim(),
        reference: this.data.meterNo,
      };
      
      try {
        await app.addFavouriteMeter(newMeter);

        const checkIfFavouriteExists = app.favouriteMeters.find((f) => f.name === newMeter.name && f.reference === newMeter. reference)
        // Prevent possible duplicates
        if(!checkIfFavouriteExists) {
          const favouriteMeters = sortFavourites([...app.favouriteMeters].concat([newMeter]))
          app.favouriteMeters = favouriteMeters;
        }
        
        app.setToastProps(this.data.i18n.addFavourite.favouriteAddSuccess, 'success');
        my.navigateBack();
      } catch (err) {
        app.setToastProps(this.data.i18n.addFavourite.favouriteAddError, 'warning');
        my.navigateBack();
      } finally {
        //my.hideLoading();
        this.setData({ isLoading: false });
      }
    }
  },
  onConfirmReplace() {
    const { meterName, meterNo } = this.data;
    this.errorModal.close();
    // Go to replace favourite page
    my.navigateTo({ url: `/pages/replace-favourite/replace-favourite?meterName=${meterName || ""}&meterNo=${meterNo || ""}&fromPay=false` });
  },
  errorModalRef(ref) {
    this.errorModal = ref;
  },
});
