const app = getApp();

Page({
  data: {
    showToast: false,
    toastContent: "",
    toastType: 'success',
    selectedFav: null,
    selectFav: false,
    isLoading: false
  },
  onLoad(query) {
    let { selectFav, meterNo, meterName } = query;
    // Check if there are any selected favourite meter
    if(meterNo && meterName)
      this.setData({ selectedFav: { name: meterName, reference: meterNo } })
    
    if (this.data.selectFav != selectFav)
      this.setData({ selectFav: selectFav || false });
    
    this.setData({ i18n: app.i18n });
  },
  onShow() {
    this.setData({ favouriteMeters: app.favouriteMeters, showToast: app.showToast, toastContent: app.toastContent, toastType: app.toastType, isLoadingMeters: false });

  },
  onHide() {
    this.onToastClose();
  },
  events:{
    onBack(){
      this.onToastClose();
    }
  },
  // Methods
  goToPayment(e) {
    const meter = e.target.dataset.value;
    app.navigateBackPayload= meter;
    my.navigateBack();
    //my.redirectTo({ url: `/pages/make_payment/make_payment?meterName=${meter.name || ""}&meterNo=${meter.reference || ""}` });
  },
  goAddFavourite() {
    my.navigateTo({ url: '/pages/add-favourite/add-favourite' });
  },
  goEditFavourite() {
    this.closeSheet();
    my.navigateTo({ url: `/pages/edit-favourite/edit-favourite?ref=${this.data.selectedFav.reference}` });
    
  },
  goConfirmRemoveFav() {
    let i18nAlertsConfirmFavouriteDelete = this.data.i18n.alerts.confirmFavouriteDelete;
    this.showAlert(i18nAlertsConfirmFavouriteDelete.title, i18nAlertsConfirmFavouriteDelete.body1, this.data.selectedFav.name, i18nAlertsConfirmFavouriteDelete.primaryBtn, 'onConfirmRemove', i18nAlertsConfirmFavouriteDelete.secondaryBtn, 'onCancelConfirmRev', '/assets/icons/remove_favourite.svg');
  },
  async onConfirmRemove() {
    this.closeSheet();
    this.setData({ isLoading: true })
    try {
      await app.deleteFavouriteMeter(this.data.selectedFav);

      const ref = this.data.selectedFav.reference;
      // Create new favorite list without deleted one
      let favouriteMeters = [...app.favouriteMeters].filter((meter) => meter.reference !== ref).sort((a, b) => a.name.localeCompare(b.name));

      app.favouriteMeters = favouriteMeters;
      this.setData({favouriteMeters: favouriteMeters});
      app.setToastProps(this.data.i18n.favourites.favouriteRemoveSuccess, 'success');
      
    } catch (err) {
      app.setToastProps(this.data.i18n.favourites.favouriteRemoveError, 'warning');
    } finally {
      this.closeModal();
      this.setData({ showToast: app.showToast, toastContent: app.toastContent, toastType: app.toastType, isLoading: false });
    }
  },
  onCancelConfirmRev() {
    this.closeModal();
  },
  // Sheet Events
  saveSheetRef(ref) {
    this.sheetRef = ref;
  },
  saveModalRef(ref) {
    this.modalRef = ref;
  },
  openSheet(e) {
    console.log(e);
    const meter = e.target.dataset.value;
    this.sheetRef.show();

    this.setData({ selectedFav: meter });
  },
  closeSheet() {
    // If is visible
    if (this.sheetRef.data.visible) {
      this.sheetRef.hide();
    }
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
          primaryBtnLbl: '',
          primaryBtnOnTap: null,
          secondaryBtnLbl: null,
          secondaryBtnOnTap: null,
        }
      });
    }
  },
  showAlert(title, body1, name1, primaryBtnLbl, primaryBtnOnTap, secondaryBtnLbl, secondaryBtnOnTap, image) {
    this.closeModal();
    this.setData({
      alertModal: {
        image: image,
        title: title,
        body1: body1,
        name1: name1,
        primaryBtnLbl: primaryBtnLbl,
        primaryBtnOnTap: primaryBtnOnTap,
        secondaryBtnLbl: secondaryBtnLbl,
        secondaryBtnOnTap: secondaryBtnOnTap,
      }
    });
    this.modalRef.show();
  },
  openToast() {
    app.showToast = true;
    this.setData({showToast: true});
  },
  onToastClose() {
    app.showToast = false;
    app.resetToastProps();
    this.setData({showToast: false});
  }
});
