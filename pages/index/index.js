import DataConverter from '/business/DataConverter';
import { DASHBOARD_NUM_PAYMENTS, DEFAULT_LANGUAGE, LS_ONBOARDING_KEY } from '/constants/app_constants';
//import favouriteMeters from '/data/favouriteMeters';
import { loadLanguage } from '/i18n/i18n';
import { formatCurrency } from '/utils/utils';

const app = getApp();

Page({
  data: {
    isOnboarding: true,
    showToast: false,
    toastContent: "",
    toastType: 'success',
    isLoadingMeters: true,
    isLoadingPayments: true,
    sections: [],
    isHidden: false,
    carouselCurrentIdx: 0
  },
  // Lifecycle Events
  onLoad(query) {
    // When page load
    this.parsePayments();

    this.setData({ favouriteMeters: app.favouriteMeters, payments: app.payments, i18n: app.i18n});
  },
  onShow() {
    my.hideBackHome();
    this.setData({ 
      carouselCurrentIdx: 0,
      favouriteMeters: app.favouriteMeters, 
      payments: app.payments, 
      showToast: app.showToast, 
      toastContent: app.toastContent, 
      toastType: app.toastType 
    });
    if(this.data.isHidden){
      this.setData({isLoadingMeters: false, isHidden: false});
    }
    app.payments && this.parsePayments();

  },
  onReady() {
    // Initialize all needs
    //TODO: to be removed when the fix was done on the apps side
    setTimeout(() => {
      // If onboarding not already performed by the user, redirect him to onboard page
      const onboardingPerformed = my.getStorageSync({ key: LS_ONBOARDING_KEY }).data;
      if (!onboardingPerformed) {
        console.log("User onboarding not yet performed. Redirecting to onboarding page...");
        my.redirectTo({ url: '/pages/onboarding/onboarding' });
      } else {
        this.setData({isOnboarding: false });
        this.initialize();
      }
    }, 500);
  },
  onHide() {
    // When page is hidden
    this.onToastClose();
  },
  events:{
    onBack(){
      this.onToastClose();
    }
  },
  onUnload() {
    // When page is closed
  },
  onTitleClick() {
    // When title is clicked
  },
  onPullDownRefresh() {
    // When page is pulled down
    if (!this.data.isLoadingMeters && !this.data.isLoadingPayments) {
      this.initialize();
    }
    my.stopPullDownRefresh();
  },
  onReachBottom() {
    // When page is pulled to the bottom
  },
  onShareAppMessage() {
    // Return to custom sharing information
    return {
      title: "M-Pesa MZ Credelec",
      desc: "M-Pesa MZ Credelec is a MiniApp to buy Credelec vouchers",
      path: "pages/index/index"
    };
  },
  
  // Methods
  async initialize() {
    this.setData({ isLoadingMeters: true, isLoadingPayments: true, i18n: app.i18n });

    try {
      loadLanguage(DEFAULT_LANGUAGE);
      this.setData({ i18n: app.i18n });
      await this.fetchFavouriteMeters();

      await this.fetchPaymentHistory();
    } catch (err) {
      this.setData({ isLoadingMeters: false, isLoadingPayments: false });
    }
  },

  async fetchFavouriteMeters() {
    try {
      // Fetch customer favourite meters
      let beneficiaries = await app.fetchFavouriteMeters();
      if(beneficiaries){
        beneficiaries = beneficiaries.sort((a, b) => a.name.localeCompare(b.name));
      }
      app.favouriteMeters = beneficiaries;

      this.setData({ favouriteMeters: beneficiaries, isLoadingMeters: false });
    } catch (err) {
      this.setData({ isLoadingMeters: false, showToast: true, toastContent: this.data.i18n.common.genericErrorToast, toastType: 'warning' });
      console.log(err);
    }
  },
  async fetchPaymentHistory() {
    try {
      // Fetch customer Payment History OR Transactions
      const payments = await app.fetchPaymentsHistory(1);
      app.setPayments(payments);
      this.setData({ payments: payments, isLoadingPayments: false });
      this.parsePayments();
    } catch (err) {
      this.setData({ isLoadingPayments: false, showToast: true, toastContent: this.data.i18n.common.genericErrorToast, toastType: 'warning' });
      console.log(err);
    }
  },
  // Event handler
  goToPayment(e) {
      my.navigateTo({ url: "/pages/make_payment/make_payment" });
  },
  onTapPayment(e) {
    app.navigateToPayload = e.target.dataset.value;
    my.navigateTo({ url: '/pages/payment-details/payment-details?canRepay=true' });
    
  },
  onStart() { },
  onEditFavourites() {
    if(!this.data.isLoadingMeters){
      my.navigateTo({ url: "/pages/favourites/favourites" });
    } 
  },
  onTapFavourite(e) {
    const { name, reference } = e.target.dataset.value;
    
    my.navigateTo({ url: `/pages/make_payment/make_payment?meterName=${name || ""}&meterNo=${reference || ""}` });
  },
  goAddFavourite() {
    if(!this.data.isLoadingMeters){
      my.navigateTo({ url: '/pages/add-favourite/add-favourite' });
      this.setData({ isLoadingMeters: true, isHidden: true }); 
    }
  },
  /**
   * manageCarouselIdx: Set the current active card position
   * @param { Event } e 
   */
  manageCarouselIdx(e) {
    this.setData({carouselCurrentIdx: e.detail.current})
  },
  openToast() {
    app.showToast = true;
    this.setData({showToast: true});
  },
  onToastClose() {
    app.showToast = false;
    app.resetToastProps();
    this.setData({showToast: false});
  },
  parsePayments() {
    this.setData({ sections: app.payments.length ? [
      {
        title: app.i18n.home.paymentLastPayment,
        data: app.payments.slice(0, DASHBOARD_NUM_PAYMENTS).map((payment) => {
          let paymentInfo = DataConverter.convertDataToPaymentInfo(payment, app.favouriteMeters);
          return {
            leftTitle: paymentInfo.meterName || app.i18n.paymentsHistory.unknownMeter,
            leftDescription: paymentInfo.meterNumber,
            rightTitle: formatCurrency(paymentInfo.totalPaid, 0, app.i18n.common.unavailable),
            rightDescription: paymentInfo.createDate ? paymentInfo.createDate.format('D MMMM YYYY') : '',
            onRowClick: (paymentInfo) => {
              app.navigateToPayload = {paymentInfo: paymentInfo, data: DataConverter.createReceiptObject(payment)};
              my.navigateTo({ url: '/pages/payment-details/payment-details?canRepay=true' });
            },
            rowData: paymentInfo
          }
        }),
        showSectionButton: true,
        sectionButtonLabel: app.i18n.home.viewMorePayment,
        sectionButtonAction: () => {my.navigateTo({url: '/pages/payments-history/payments-history' })} 
      }
    ] : [] });
  }
});
