import MpesaComponent from '../core/mpesa-component'
import addClass from '/utils/addClass'
import removeClass from '/utils/removeClass'

Component(MpesaComponent({
  exportInputHandler: true,
  mixins: [],
  data: {
    inputValue: '',
    showClearIcon: false,
    inputCssClass: '',
    inputTypeClass: 'm-input__text-box'
  },
  props: {
    type: 'text', // text || number || digit
    maxlength: 140,
    placeholder: '',
    showLoader: false,
    helperMsg: '',
    showCounter: false,
    counterMsg: '',
    errorMsg: '',
    inputType: 'text-box' // 'text-box' || 'text-field' (not supported yet) || 'text-field-amount'
  },
  didMount() {
    this.setInputTypeClass()
    this.setIconInnerLeftStyle()
    this.setErrorStyle()
  },
  deriveDataFromProps(nextProps) {
    this.updateClearIcon(nextProps)
  },
  didUpdate() {
    this.setErrorStyle()
  },
  didUnmount() {},
  methods: {
    updateClearIcon(props) {
      if (!props) props = this.props
      const { showLoader } = props
      const { inputValue } = this.data
      if (inputValue && !showLoader) {
        this.setData({
          showClearIcon: true
        })
      } else {
        this.setData({
          showClearIcon: false
        })
      }
    },
    onInputFocus (e) {
      const { inputTypeClass } = this.data
      const { onInputFocus } = this.props
      if (onInputFocus) onInputFocus(e)
      this.setData({
        inputTypeClass: addClass(inputTypeClass, 'm-input--focus')
      });
    },
    onInputBlur (e) {
      const { onInputBlur } = this.props
      const { inputTypeClass } = this.data
      if (onInputBlur) onInputBlur(e)
      this.setData({
        inputTypeClass: removeClass(inputTypeClass, 'm-input--focus')
      });
    },
    onInput (e) {
      const { onInput } = this.props
      const { value: inputValue } = e.detail

      this.setData({
        inputValue,
      }, () => {
        this.updateClearIcon()
      })

      if (onInput) onInput(e)
    },
    onClearIconTap (e) {
      const { onInput } = this.props
      this.setData({
        inputValue: '',
        showClearIcon: false,
      }, () => {
        this.updateClearIcon()
      })
      if (onInput) {
        const detail = e.detail ? e.detail : {}
        detail.value = ''
        onInput({ ...e, detail })
      }
    },
    setIconInnerLeftStyle () {
      const { inputCssClass } = this.data
      const iconInnerLeft = this.props.$slots.iconInnerLeft
      iconInnerLeft && iconInnerLeft.length > 0 && this.setData({
        inputCssClass: addClass(inputCssClass, 'has-icon-inner-left')
      })
    },
    setErrorStyle () {
      const { inputCssClass } = this.data
      if (this.props.errorMsg) {
        this.setData({
          inputCssClass: addClass(inputCssClass, 'error')
        })
      } else {
        this.setData({
          inputCssClass: removeClass(inputCssClass, 'error')
        })
      }
    },
    setInputTypeClass () {
      switch (this.props.inputType) {
        case 'text-field': 
          this.setData({
            inputTypeClass: 'm-input__text-field'
          })
          break
        case 'text-field-amount': 
          this.setData({
            inputTypeClass: 'm-input__text-field m-input__text-field--amount'
          })
          break
        default:
          this.setData({
            inputTypeClass: 'm-input__text-box'
          })
      }
    },
  },
}));
