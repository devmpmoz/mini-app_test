Component({
  mixins: [],
  data: {},
  props: {
    activeBorderColor: "#e60000",
    borderColor: "#999999",
    suggestionList: [],
    currencySymbol: "",
    selected: 0,
    onSuggestionClick: null
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // Callback to parent component sending the selected suggestion
    onSuggestionClick(e) {
      this.props.onSuggestionClick && this.props.onSuggestionClick(e);
    },
  },
});
