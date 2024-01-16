Component({
  mixins: [],
  data: {},
  props: {
    label: '',
    description: null,
    iconSrc: null,
    trailingIconSrc: null,
    leadingIconSrc: null,
    showLeadingArrow: true,
    value: null,
    onTap: null,
    wrapperExtraClass: '',
    leftIconWrapperExtraClass: '',
    labelExtraClass: '',
    descriptionExtraClass: '',
    rightIconWrapperExtraClass: ''
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onTap(e) {
      if (this.props.onTap) {
        this.props.onTap(e);
      }
    }
  },
});
