const app = getApp();

Page({
  data: {
    showToast: false,
    toastContent: "",
    toastType: 'success',
  },
  onLoad(query) {
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    this.setData({ meterName:  query.meterName || '', meterNo: query.meterNo || '', meterNoExists: query.meterNo ? app.favouriteMeters.find(meter => meter.reference === query.meterNo) : false, amount: query.amount || "", i18n: app.i18n, voucher: app.navigateToPayload });
  },
  onShow() {
    my.hideBackHome();
  },

  onHide() {
    this.onToastClose();
  },
  // Methods
  onContinue(e) {
    let { meterNo } = this.data;
    my.navigateTo({ url: `/pages/save-meter/save-meter?meterNo=${meterNo || ""}` });
  },
  onViewVoucher(e) {
    // TODO: navigate to Receipt page
    my.navigateTo({ url: '/pages/payment-details/payment-details' });
  },
  onFinishFlow(){
    my.reLaunch({url: '/pages/index/index'}); // back until index
  },

  handleDownloadReceipt() {
    app.navigateToPayload = {...this.data.voucher, vat: this.data.voucher.tax};
    my.navigateTo({ url: `/pages/ticket_screen/ticket_screen?amount=${this.data.amount}` });
  },

  textCopied(data) {
    this.setData({ showToast: true, toastContent: this.data.i18n.paymentResult.copiedSuccess, toastType: "" });
  },

  textNotCopied(data) {
    this.setData({ showToast: true, toastContent: this.data.i18n.paymentResult.copiedError, toastType: "" });
  },

  openToast() {
    this.setData({showToast: true});
  },
  onToastClose() {
    this.setData({showToast: false});
  }
});
