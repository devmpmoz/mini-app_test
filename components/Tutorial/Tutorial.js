Component({
  mixins: [],
  data: {
    currentStep: 0,
  },
  props: {
    onClickFinalStep: null,
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onClickNext() {
      // Jump to next step, or trigger event if the user has reached the end of the turorial
      let numSteps = Object.keys(this.props.$slots).length;
      let isLastStep = this.data.currentStep >= numSteps - 1;
      if (isLastStep) {
        this.props.onClickFinalStep && this.props.onClickFinalStep();
      } else {
        this.setData({ currentStep: this.data.currentStep + 1 });
      }
    },
    onSwipeStep(ev) {
      this.setData({ currentStep: ev.detail.current });
    }
  },
});
