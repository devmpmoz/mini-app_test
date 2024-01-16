import MpesaComponent from '../core/mpesa-component'

Component(MpesaComponent({
  mixins: [],
  data: {
    defaultClasses: 'm-btn'
  },
  props: {
    type: 'primary',
    size: 'large',
    uppercase: false,
    disabled: false,
    loading: false,
    loadingColor: '#fff'
  },
  didMount() {
    const { props } = this
    const upperCaseClass = props.uppercase ? 'm-btn-uppercase' : ''
    this.setData({
      defaultClasses: `m-btn m-btn-${props.type} m-btn-${props.size} ${upperCaseClass}`
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    onTap() {
      !this.props.loading && this.props.onTap()
    }
  },
}));
