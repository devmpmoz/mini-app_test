Component({
  mixins: [],
  data: {},
  props: {
    name: '',
    title: '',
    subtitle: '',
    badgeText: '',
    isLoading: false,
    value: null,
    onTap: null,
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
