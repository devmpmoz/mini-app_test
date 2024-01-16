Component({
  mixins: [],
  data: {},
  props: {
    topTitle: '',
    topDescription: '',
    bottomText: '',
    buttonText: '',
    isLoading: false,
    value: null,
    onTap: null,
    cardExtraStyle: '',
    topTitleExtraStyle: '',
    topDescriptionExtraStyle: '',
    buttonExtraStyle: '',
    buttonTextExtraStyle: '',
    bottomTextExtraStyle: '',
    buttonExtraStyle: '',
    topRowBackground: '',
    bottomRowBackground: '',
    isSmallCard: false,
    onlyTitle: true
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
