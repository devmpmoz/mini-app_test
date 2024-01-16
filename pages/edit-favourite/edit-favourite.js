import { meterNameValidator, meterNoValidator } from '/utils/validator';

const app = getApp();

Page({
  data: {
    meterNo: '',
    meterName: '',
    oldMeter: null,
    isLoading: false,
    isMeterNameValid: false,
    isMeterNoValid: false,
  },
  // Lifecycle Events
  onLoad(query) {
    let reference = query.ref;
    let meter = app.favouriteMeters.find(meter => meter.reference === reference);
    // Get favourite list without current favourite
    this.favouriteMeters = [...app.favouriteMeters].filter((meter) => meter.reference !== reference);
    
    this.setData({ meterName:  meter.name || '', meterNo: meter.reference || '', oldMeter: { name:  meter.name || '', reference: meter.reference || '' }, i18n: app.i18n });

    // Validate current data
    this.meterNameValidator();
    this.meterNoValidator();
  },
  onShow() {},
  onReady() {},

  // Event handler
  handleInputChange(e) {
    this.setData({ [e.target.dataset.field]: e.detail.value });
  },
  meterNameValidator(e) {
    let { meterName, i18n } = this.data;

    let result = meterNameValidator(meterName, i18n);

    // If did pass the validation and has 3 characteres
    if (result === null && meterName.trim().length >= 3) {
      // Find a favourite with same meter name based on the user's favourites
      let foundFavourite = this.favouriteMeters.find(meter => meter.name.toLowerCase() === meterName.toLowerCase());

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
      let foundFavourite = this.favouriteMeters.find(meter => meter.reference === meterNo);

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
  async onSave(e) {
    let { meterName, meterNo, oldMeter } = this.data;

    // If the new meter details are different from old meter
    if (meterName !== oldMeter.name || meterNo !== oldMeter.reference) {
      const newMeter = {
        name: meterName.trim(),
        reference: meterNo,
      };
  
      this.setData({ isLoading: true });
      //my.showLoading();
  
      try {
        await app.updateFavouriteMeter(this.data.oldMeter, newMeter);
  
        const oldMeterReference = this.data.oldMeter.reference;
        
        // Iterate Array while locate the meter to update the meter data
        const favouriteMeters = [...app.favouriteMeters].map((meter) => {
          if (meter.reference === oldMeterReference) {
            meter.name = newMeter.name;
            meter.reference = newMeter.reference;
          }
  
          return meter;
        }).sort((a, b) => a.name.localeCompare(b.name));
  
        app.favouriteMeters = favouriteMeters;
        app.setToastProps(this.data.i18n.editFavourite.favouriteEditSuccess, 'success');
        my.navigateBack();
      } catch (err) {
        app.setToastProps(this.data.i18n.editFavourite.favouriteEditError, 'warning');
        my.navigateBack();
      } finally {
        //my.hideLoading();
        this.setData({ isLoading: false });
      }

      //Mocked data

        // const newMeter = {
        //   name: meterName.trim(),
        //   reference: meterNo,
        // };


        // const oldMeterReference = this.data.oldMeter.reference;
        
        // // Iterate Array while locate the meter to update the meter data
        // const favouriteMeters = [...app.favouriteMeters].map((meter) => {
        //   if (meter.reference === oldMeterReference) {
        //     meter.name = newMeter.name;
        //     meter.reference = newMeter.reference;
        //   }
  
        //   return meter;
        // });
  
        // app.favouriteMeters = favouriteMeters;
  
        // app.setToastProps('Favourite successfully updated', 'success');
        // my.navigateBack();
    } else {
      my.navigateBack();
    }
  }
});
