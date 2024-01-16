
Component({
  mixins: [],
  data: {},
  props: {
    componentID: '',
    value: null,
    onCopySuccess: null,
    onCopyError: null
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleOnTap(e) {
      my.setClipboard({
        text: this.props.value,
        success: (data)=>{
          if(this.props.onCopySuccess){
            this.props.onCopySuccess(data);
          }
        },
        fail: (error) => {
          console.error("Failed to copy to clipboard: " + this.props.value, error);
          if(this.props.onCopyError){
            this.props.onCopyError(data);
          }
        }
      });
    }
  },
});
