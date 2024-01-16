import MpesaComponent from '../core/mpesa-component'

Component(MpesaComponent({
  mixins: [],
  data: {
    defaultClasses: 'm-nav',
  },
  props: {
    title: null,
    size: 'small'
  },
  validateProps: {
    size: (val) => [
      'small',
      'medium',
      'large',
    ].includes(val),
  },
  didMount() {
    const { props } = this
    this.setData({
      defaultClasses: `m-nav m-nav-${props.size}`
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {},
}));
