const app = getApp();

Page({
  data: {
    fromPay: false,
  },
  onLoad(query) {
    console.log(query);
    this.setData({ newMeter: { name: query.meterName || '', reference: query.meterNo || '' }, fromPay: query.fromPay || false, i18n: app.i18n });
  },
  onShow() {
    this.setData({ favouriteMeters: app.favouriteMeters });
  },
  confirmReplace(e){
    let i18nAlertsReplace = this.data.i18n.alerts.replaceLimit;
    const oldMeter = e.target.dataset.value;
    this.setData({oldMeter: oldMeter});
    this.showError(i18nAlertsReplace.title, i18nAlertsReplace.body1, oldMeter.name || '', this.data.newMeter.name || '', 'replaceFavourite', i18nAlertsReplace.primaryBtn, i18nAlertsReplace.secondaryBtn, 'onCancelModal');
  },
  async replaceFavourite() {
    // Favourite to replace
    const oldMeter = this.data.oldMeter;

    const newMeter = this.data.newMeter;

    this.setData({ isLoading: true });
    //my.showLoading();

    try {
      await app.updateFavouriteMeter(oldMeter, this.data.newMeter, true);

      const oldMeterReference = oldMeter.reference;
      
      // Replace the old meter with new meter
      const favouriteMeters = [...app.favouriteMeters].map((meter) => {
        if (meter.reference === oldMeterReference) {
          meter.name = newMeter.name;
          meter.reference = newMeter.reference;
        }

        return meter;
      }).sort((a, b) => a.name.localeCompare(b.name));

      app.favouriteMeters = favouriteMeters;

      app.setToastProps(this.data.i18n.replaceFavourite.favouriteReplaceSuccess, 'success');

      if(this.data.fromPay == "true"){
        my.redirectTo({url: '/pages/index/index'});
      } else {
        my.navigateBack({delta: 2});
      }
      
    } catch (err) {
      app.setToastProps(this.data.i18n.replaceFavourite.favouriteReplaceError, 'warning');
      if(this.data.fromPay == "true"){
        my.redirectTo({url: '/pages/index/index'});
      } else {
        my.navigateBack({delta: 2});
      }
    } finally {
      //my.hideLoading();
      this.setData({ isLoading: false });
    }
  },
  onCancelModal() {
    this.closeModal();
  },
  saveModalRef(ref) {
    this.modalRef = ref;
  },
  closeModal() {
    // Check modal is visible
    if (this.modalRef.isVisible()) {
      this.modalRef.hide();
      this.setData({
        alertModal: {
          image: '',
          title: '',
          body1: '',
          name1: '',
          name2: '',
          primaryBtnLbl: '',
          primaryBtnOnTap: null,
          secondaryBtnLbl: null,
          secondaryBtnOnTap: null,
        }
      });
    }
  },
  showAlert(title, body1, name1, name2, primaryBtnLbl, primaryBtnOnTap, secondaryBtnLbl, secondaryBtnOnTap, image) {
    this.closeModal();
    this.setData({
      alertModal: {
        image: image,
        title: title,
        body1: body1,
        name1: name1,
        name2: name2,
        primaryBtnLbl: primaryBtnLbl,
        primaryBtnOnTap: primaryBtnOnTap,
        secondaryBtnLbl: secondaryBtnLbl,
        secondaryBtnOnTap: secondaryBtnOnTap,
      }
    });
    this.modalRef.show();
  },
  showError(error, errorMsg, name1, name2, primaryBtnFunction = 'closeModal', primaryBtnLbl = this.data.i18n.common.btnRetry, secondaryBtnLbl = this.data.i18n.common.btnCancel, secondaryBtnFunction = 'closeModal', image = '/assets/icons/hi_replace_favorite.svg') {
    this.showAlert(error, errorMsg, name1, name2, primaryBtnLbl, primaryBtnFunction, secondaryBtnLbl, secondaryBtnFunction, image);
  },
})