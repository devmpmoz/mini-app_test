Component({
  mixins: [],
  data: {},
  props: {
    iconName: "",
    borderColor: "#666",
    label: "",
    width: 18,
    height: 18,
    isLoading: false,
    isVertical: false,
    onButtonClick() {},
    iconExtraStyle: "",
    horizontalIconExtraStyle: "",
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    /**
     * onTap: Invokes callback function, if sent by the parent component, if the component isn't
     * in a loading state
     */
    onTap() {
      if (!this.props.isLoading) {
        this.props.onButtonClick && this.props.onButtonClick();
      }
    },
  },
});
