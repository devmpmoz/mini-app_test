Component({
  mixins: [],
  data: {},
  props: {
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
