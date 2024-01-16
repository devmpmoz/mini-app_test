Component({
  mixins: [],
  data: {},
  props: {
    hasBackground: true,
    backgroundIllustration: "/assets/illustrations/star.svg",
    backgroundColor: '#EB9700',
    backgroundIllustrationMarginRight: '62rpx',
    imageButtonContentExtraStyle: '',
    iconName: 'si_plus.svg',
    iconWidth: '32',
    iconHeight: '32',
    iconButtonLabelExtraStyle: '',
    label: '',
    onButtonClick: ()=>{}
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onTap(){
      if(this.props.onButtonClick){
        this.props.onButtonClick();
      }
    }
  },
});
