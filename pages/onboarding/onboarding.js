import { LS_ONBOARDING_KEY } from "/constants/app_constants";

const app = getApp();

Page({
  data: {
    i18n: app.i18n,
  },
  onLoad() {},
  onReady() {
    if (my.canIUse('hideBackHome')) {
      my.hideBackHome();
    }
  },

  // Methods
  handleFinishOnboarding() {

    // Mark the onboarding as being complete (in the local storage)
    my.setStorage({
      key: LS_ONBOARDING_KEY,
      data: "true",
      fail: function() {
        console.error("Failed to store onboarding completion flag.");
      }
    });

    // Send user to home page
    my.redirectTo({ url: '/pages/index/index' });
  }
});
