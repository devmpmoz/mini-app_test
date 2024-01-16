//Input type and mode text, number, decimal, amount, amountWithBalance
Component({
  mixins: [],
  data: {
    errorMsg: null
  },
  props: {
    componentID: '',
    className: '',
    id: '',
    label: '',
    description: '',
    descriptionHero: '',
    placeholder: '',
    value: '',
    maxlength: 140,
    helperMsg: '',
    hasButton: false,
    isClearIconVisible: false,
    searchIconVisible: false,
    buttonIconName: '',
    clearIconTopPosition: '',
    clearIconSize: '',
    inputDisabled: false,
    type: 'text',
    balance: 0,
    field: '',
    onBlur: null,
    onInput: null,
    onIconButtonClick: null,
    onValidation: null,
    hasSuggestions: false,
    suggestionSymbol: '',
    suggestionItems: [],
    onSuggestionClick: null
  },
  didMount() {
    if (this.props.onValidation) {
      let result = this.props.onValidation();
      this.setData({ errorMsg: result });
    }
    this.setData({selectedSuggestion: this.props.value });
  },
  didUpdate() {
    if (this.props.onValidation) {
      let result = this.props.onValidation();
      this.setData({ errorMsg: result });
    }
    this.setData({selectedSuggestion: this.props.value });
  },
  didUnmount() {},
  methods: {
    onBlur(e) {
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    },
    onInput(e) {
      if (this.props.onInput) {
        this.props.onInput(e);

        if (this.props.onValidation) {
          let result = this.props.onValidation(e);
          this.setData({ errorMsg: result });
        }
      }
      this.setData({selectedSuggestion: e.detail.value })
    },
    onIconButtonClick(e) {
      if (this.props.onIconButtonClick) {
        this.props.onIconButtonClick(e);
      }
    },
    onSuggestionClick(e){
      if (this.props.onSuggestionClick) {
        this.props.onSuggestionClick(e);
      }
      const valueSelected = e.target.dataset.value;

      this.setData({selectedSuggestion: valueSelected })

      if (this.props.onValidation) {
        let result = this.props.onValidation(e);
        this.setData({ errorMsg: result });
      }
    }
  },
});
