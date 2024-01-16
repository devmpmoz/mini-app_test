import DataConverter from "/business/DataConverter";
import { formatCurrency, groupArrayValues } from "/utils/utils";

const app = getApp();

Page({
  data: {
    isLoading: true,
    sections: [],
  },
  onLoad() {
    this.setData({ i18n: app.i18n });
  },
  onShow() {
    this.initialize(false);
  },
  onPullDownRefresh() {
    // When page is pulled down
    if (!this.data.isLoading) {
      this.initialize(true);
    }
    my.stopPullDownRefresh();
  },
  onHide() {
    this.onToastClose();
  },
  onToastClose() {
    this.setData({showToast: false});
  },

  async initialize(refetch) {
    let paymentsData = app.payments;

    if (refetch) {
      this.setData({ isLoading: true });

      try {
        paymentsData = await app.fetchPaymentsHistory();
        app.setPayments(paymentsData);
      } catch (error) {
        console.error('Failed to load payments history', error);
        this.setData({ isLoading: false, showToast: true, toastContent: this.data.i18n.paymentsHistory.toastError, toastType: 'warning' });
      }
    }
    
    const payments = DataConverter.convertDataToPaymentInfoArray(paymentsData, app.favouriteMeters);
    const groupedPayments = groupArrayValues(payments, (paymentA, paymentB) => {
      return paymentA.createDate.isSame(paymentB.createDate, 'day');
    });

    const listSections = [];
    let sectionTitle;
    let sectionData;

    groupedPayments.map((group) => {

      sectionTitle = group[0].createDate ? group[0].createDate.format('D MMMM YYYY') : '';
      sectionData = [];

      group.map((paymentInfo) => {
        sectionData.push({
          leftTitle: paymentInfo.meterName || app.i18n.paymentsHistory.unknownMeter,
          leftDescription: paymentInfo.meterNumber,
          rightTitle: formatCurrency(paymentInfo.totalPaid, 0, app.i18n.common.unavailable),
          rightDescription: paymentInfo.createDate ? paymentInfo.createDate.format('D MMMM YYYY') : '',
          onRowClick: (paymentInfo) => {
            app.navigateToPayload = {paymentInfo, data: DataConverter.createReceiptObject(paymentInfo.data)};
            my.navigateTo({ url: '/pages/payment-details/payment-details?canRepay=true' });
          },
          rowData: paymentInfo
        });
      });

      listSections.push({
        title: sectionTitle,
        data: sectionData,
      });
    });

    this.setData({ sections: listSections, isLoading: false });
  }
});
