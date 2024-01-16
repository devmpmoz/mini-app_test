import dayjs from 'dayjs';

import PaymentInfo from "./data/PaymentInfo"

import PT from 'dayjs/locale/pt'

// Set the Portuguese (Portugal) locale globally for dayjs
dayjs.locale(PT);

const DataConverter = {

  convertDataToPaymentInfo: (paymentData, favourites) => {
    const payment = new PaymentInfo();
    let favourite = ''
    if(favourites) {
      const foundFavourite = favourites.find((f) => f.reference === paymentData.billreferencenumber)
      if(foundFavourite) {
        favourite = foundFavourite.name
      }
    }

    payment.meterName = favourite;
    payment.meterNumber = paymentData.billreferencenumber;
    payment.createDate = paymentData.timestamp ? dayjs(paymentData.timestamp) : "";
    payment.totalPaid = paymentData.amount;
    payment.voucher = paymentData.trx_data.recharge;
    payment.transactionId = paymentData.third_party_id;
    payment.fees = paymentData.trx_data.tax;
    payment.data = paymentData;

    return payment;
  },

  convertDataToPaymentInfoArray: (paymentArrayData, favourites) => {
    return paymentArrayData.map((paymentData) => {
      return DataConverter.convertDataToPaymentInfo(paymentData, favourites);
    });
  },

  createReceiptObject: (data) => {
    const parsedData = {
      meter: data.trx_data.meter,
      token: data.trx_data.recharge,
      energyValue: data.trx_data.token_amount,
      vat: data.trx_data.tax,
      debtPaid: data.trx_data.debt_paid,
      debtAmount: data.trx_data.debt_to_pay,
      garbageFee: data.trx_data.garbage_tax,
      radioFee: data.trx_data.radio_tax,
      amountPaid: data.trx_data.total_paid,
      energyUnit: data.trx_data.energy,
      reference: data.receipt_number,
      createDate: data.timestamp
    };
    
    return parsedData;
  }
};

export default DataConverter;