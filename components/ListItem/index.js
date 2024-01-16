Component({
  mixins: [],
  data: {},
  props: {
    componentID: '',
    extraStyle: '',
    extraContentStyle: '',
    leftIconStyle: '',
    leftIconURL: '',
    leftIconName: 'settings.svg',
    leftIconColor: '#000',
    extraContainerStyle: '',
    description: 'Description',
    extraDescription: 'extraDescription',
    componentDescription: '',
    labelStyle: '',
    label: 'label',
    rightLabel: 'rightLabel',
    rightDescription: 'rightDescription',
    rightLabelComponent: 'rightLabelComponent',
    rightLabelStyle: '',
    rightLabelColor: '#000',
    arrow: 'up',
    rightDescriptionColor: '#000',
    rightIconStyle: '',
    rightIconName: 'settings.svg',
    rightStatusChip: '',
    hasCheckbox: false,
    checked: false,
    extraSeparatorStyle: '',
    rootStyle: '',
    onTap: null,
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onTap(e) {
      console.log(e);
      if (this.props.onTap) {
        this.props.onTap(e);
      }
    }
  },
});