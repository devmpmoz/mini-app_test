Component({
  mixins: [],
  data: {
    errorInfo: {
      title: null,
      description: null,
      image: null,
      primaryBtnLabel: null,
      primaryBtnOnTap: null,
      secondaryBtnLabel: null,
      secondaryBtnOnTap: null,
    },
  },
  props: {},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    setAlertRef(ref) {
      this.alertRef = ref;
    },

    onTapPrimaryBtn() {
      if (this.data.errorInfo && this.data.errorInfo.primaryBtnOnTap) {
        this.data.errorInfo.primaryBtnOnTap();
      } else {
        this.close();
      }
    },

    onTapSecondaryBtn() {
      if (this.data.errorInfo && this.data.errorInfo.secondaryBtnOnTap) {
        this.data.errorInfo.secondaryBtnOnTap();
      } else {
        this.close();
      }
    },
    
    open(errorInfo) {
      if (this.alertRef && !this.alertRef.isVisible()) {
        this.setData({ errorInfo });
        this.alertRef.show();
      }
    },

    close() {
      if (this.alertRef && this.alertRef.isVisible()) {
        this.alertRef.hide();
      }
    }
  }
});
