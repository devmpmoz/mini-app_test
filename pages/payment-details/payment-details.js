import { formatToken } from "/utils/utils";

const app = getApp();

Page({
  data: {
    i18n: null,
    canRepay: false,
    paymentInfo: null,
    createDateFormated: '',
  },
  onLoad(query) {
    this.setData({
      i18n: app.i18n,
      canRepay: query.canRepay || false,
      paymentInfo: app.navigateToPayload.paymentInfo,
      formattedVoucher: app.navigateToPayload.paymentInfo.voucher ? formatToken(app.navigateToPayload.paymentInfo.voucher) : undefined,
      createDateFormated: app.navigateToPayload.paymentInfo.createDate ? app.navigateToPayload.paymentInfo.createDate.format('D MMMM YYYY - H:mm') : '',
    });
  },
  onShow() {},
  onBack() {
    my.navigateBack();
  },
  onRepay(e) {
    const { meterName, meterNumber, totalPaid } = this.data.paymentInfo;
    
    my.navigateTo({ url: `/pages/make_payment/make_payment?meterName=${meterName || ""}&meterNo=${meterNumber || ""}&amount=${totalPaid}` });
  },

  // Methods
  handleDownloadReceipt() {
    my.navigateTo({ url: `/pages/ticket_screen/ticket_screen?amount=${this.data.paymentInfo.totalPaid}` });
  }

});
