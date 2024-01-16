import MpesaComponent from '../core/mpesa-component';

Component(MpesaComponent({
  mixins: [],
  data: {},
  props: {
    type: 'shade',
  },
  validateProps: {
    type: (val) => [
      'blur',
      'white',
      'shade',
    ].includes(val),
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {},
}));
