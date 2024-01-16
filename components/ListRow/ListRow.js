Component({
  mixins: [],
  data: {},
  props: {
    componentID: '',
    extraStyle: '',
    extraContentStyle: '',
    leftIconStyle: '',
    leftIconURL: '',
    leftIconName: '',
    leftIconColor: '#000',
    extraContainerStyle: '',
    description: '',
    extraDescription: '',
    componentDescription: '',
    labelStyle: '',
    label: '',
    rightLabel: '',
    rightDescription: '',
    rightLabelComponent: '',
    rightLabelStyle: '',
    rightLabelColor: '#000',
    arrow: 'up',
    rightDescriptionColor: '#000',
    rightIconStyle: '',
    rightIconName: '',
    rightStatusChip: '',
    hasCheckbox: false,
    checked: false,
    extraSeparatorStyle: '',
    rootStyle: '',
    value: '',
    onTap: null
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    listRowTap(e) {
      if (this.props.onTap) {
        this.props.onTap(e);
      }
    }
  },
});
