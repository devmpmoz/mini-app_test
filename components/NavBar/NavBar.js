import MpesaComponent from '../v2/mpesa/core/mpesa-component'

Component(MpesaComponent({
  mixins: [],
  data: {
    defaultClasses: '',
  },
  props: {
    title: null,
    size: 'small',
    toolbarComponentsExtraStyle: "",
    extraToolbarComponents: false,
    isFullComponentsBackground: false
  },
  validateProps: {
    size: (val) => [
      'small',
      'medium',
      'large',
    ].includes(val),
  },
  didMount() {
    my.setNavigationBar({
      title: ''
    });

    const {
      titleBarHeight,
      statusBarHeight,
    } = my.getSystemInfoSync();
    
    const { props } = this
    this.setData({
      defaultClasses: `${props.isFullComponentsBackground ? '' : 'vfmp-nav'} vfmp-nav-${props.size}`,
      titleBarHeight: titleBarHeight || 44,
      statusBarHeight: statusBarHeight || 24
    });
  },
  didUpdate() {
    my.setNavigationBar({
      title: ''
    });

    const {
      titleBarHeight,
      statusBarHeight,
    } = my.getSystemInfoSync();
    
    const { props } = this
    this.setData({
      defaultClasses: `${props.isFullComponentsBackground ? '' : 'vfmp-nav'} vfmp-nav-${props.size}`,
      titleBarHeight: titleBarHeight || 44,
      statusBarHeight: statusBarHeight || 24
    });

  },
  didUnmount() {},
  methods: {},
}));
