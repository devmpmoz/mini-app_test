const app = getApp();

Page({
  data: {},
  onLoad() {
    this.setData({ i18n: app.i18n });
  },
  onShow() {},
  events: {
    onBack() {
      my.navigateBack({delta: 100}); // back until index
    }
  },
  // Methods
  onDone(e) {
    my.navigateBack({delta: 100}); // back until index
  },
});
