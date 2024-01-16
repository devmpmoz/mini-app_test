import dayjs from "dayjs";
import base64 from "base-64";
import { formatToken, formatValueToQueryParam } from "/utils/utils";
import { EXTERNAL_API_PDF } from '/constants/app_constants';

const app = getApp();

Page({
  data: {
    amount: "",
    formattedToken: "",
    voucher: null,
    downloadInProgress: false,
    showToast: false,
    toastContent: "",
    toastType: 'success'
  },
  onLoad(query) {
    const voucherData = 'data' in app.navigateToPayload ? app.navigateToPayload.data : app.navigateToPayload;
    this.setData({ 
      i18n: app.i18n, 
      amount: query.amount, 
      voucher: voucherData, 
      formattedToken: voucherData && voucherData.token ? formatToken(voucherData.token) : "", 
      createDateFormated: voucherData && voucherData.createDate ? dayjs(voucherData.createDate).format('D MMMM YYYY - H:mm') : "" 
    });
  },
  onHide() {
    this.onToastClose();
  },
  events:{
    onBack(){
      this.onToastClose();
    }
  },
  onShow(){},
  // METHODS
  /**
   * onDownloadReceipt: Request's server for the pdf preview and adds the capability for the user
   * to save it or download it
   */
  async onDownloadReceipt(){
    this.setData({downloadInProgress: true});
    const { voucher } = this.data;
    const { 
      token, 
      meter, 
      vat, 
      debtPaid, 
      debtAmount, 
      radioFee, 
      garbageFee, 
      amountPaid, 
      energyValue, 
      energyUnit, 
      reference ,
      createDate
    } = voucher
    
    const dataToSend = {
      miniApp: 'CREDELEC',
      token: formatValueToQueryParam(token, false, true),
      meter: formatValueToQueryParam(meter),
      vat: formatValueToQueryParam(vat, true),
      debtPaid: formatValueToQueryParam(debtPaid, true),
      debtAmount: formatValueToQueryParam(debtAmount, true),
      radioFee: formatValueToQueryParam(radioFee, true),
      garbageFee: formatValueToQueryParam(garbageFee, true),
      amountPaid: formatValueToQueryParam(amountPaid, true),
      energyValue: formatValueToQueryParam(energyValue, true),
      energyUnit: formatValueToQueryParam(energyUnit, true),
      reference: formatValueToQueryParam(reference),
      date: formatValueToQueryParam(createDate),
      lang: 'pt'
    }

    const urlParams = `data=${base64.encode(JSON.stringify(dataToSend))}`

    console.log(urlParams)
     my.downloadFile({
      url: `${EXTERNAL_API_PDF}?${urlParams}`,
      header: {
        "Content-Type": "application/pdf"
      },
      success:({ apFilePath }) => {
        my.openDocument({
          filePath: apFilePath,
          fileType: 'pdf',
          success: (res) => {
            this.setData({downloadInProgress: false});
            console.log('Successfully open pdf preview');
            console.log(res);
          },
          fail: (err)=>{
            this.setData({downloadInProgress: false});
            console.log('Error while trying to open pdf preview: ' + err);
            app.setToastProps(this.data.i18n.receipt.unableToDownload, 'warning');
            this.setData({ showToast: true, toastContent: app.toastContent, toastType: app.toastType })
          }
        })
      },
      fail: (err) => {
        this.setData({downloadInProgress: false});
        console.log('Error while trying to download pdf: ' + err);
        app.setToastProps(this.data.i18n.receipt.unableToDownload, 'warning');
        this.setData({ showToast: true, toastContent: app.toastContent, toastType: app.toastType })
      },
    });
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
