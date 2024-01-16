import { APP_ERRORS } from "/constants/app_constants";
import { createModalErrorInfo, formatToken } from "/utils/utils";

const app = getApp();

Page({
  data: {
    isLoading: false,
    shortcode: app.globalData.shortcode,
    errorInfo: null,
  },
  onLoad(query) {
    this.setData({ meterName:  query.meterName || '', meterNo: query.meterNo || '-', amount: Number.parseFloat(query.amount) || undefined, chargeAmount: Number.parseFloat(query.chargeAmount) >= 0 ? Number.parseFloat(query.chargeAmount) : undefined, i18n: app.i18n });
  },
  onShow() {},
  // Methods
  async onConfirm(e) {
    this.setData({ isLoading: true });

    let { meterName, meterNo, amount } = this.data;
    try {
      let data = await app.buyCredelec(meterNo, amount);

      // MOCKED DATA
      // let data = {
      //   amountPaid: "81",
      //   debtAmount: "0",
      //   debtPaid: "0",
      //   energyUnit: "40",
      //   energyValue: "109.8",
      //   garbageFee: "0",
      //   meter: "37245604154",
      //   radioFee: "0",
      //   reference: "AHV109YC01",
      //   requestId: "AHV109YC01",
      //   tariff: "",
      //   token: "03229579608176831560",
      //   tax: "90",
      //   timestamp: "20230906115426"

      if(!data.meter){
        this.handlePaymentError(APP_ERRORS.UNKNOWN) 
      } else {
        data = {
          ...data,
          formattedToken: data.token && formatToken(data.token),
          receipt_number: data.reference,
          createDate: data.timestamp,
        }
        app.navigateToPayload = data;
        const showAmount = this.data.chargeAmount != undefined ? amount + this.data.chargeAmount : amount;
        my.reLaunch({ url: `/pages/payment_result/payment_result?meterName=${meterName || ""}&meterNo=${meterNo || ""}&amount=${showAmount}` });
      }
    } catch (err) {
      
      this.handlePaymentError(err.errorCode) 
    } finally {
      this.setData({ isLoading: false });
    }
  },
  cancelPayment(){
    my.reLaunch({ url: '/pages/index/index' });
  },
  /**
   * handlePaymentError: Checks the error code and throws the error accordingly
   * @param {string} errorCode : App error code
   */
  handlePaymentError(errorCode) {
    const onCancelFn = this.cancelPayment.bind(this);
    const errorInfo = createModalErrorInfo(this.data.i18n, errorCode, onCancelFn);
    this.errorModal.open(errorInfo);
  },
  errorModalRef(ref) {
    this.errorModal = ref;
  },
});
