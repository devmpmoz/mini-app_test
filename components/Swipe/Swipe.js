Component({
  mixins: [],
  data: {
    startY: 0,
    lastY: 0,
    derivedAnimation: null,
    swipeAnimation: null,
  },
  props: {
    disabled: false,
    animation: null,
    onSwipeVertical: null,
    onSwipeEnd: null,
  },
  didMount() {
    this.updateAnimation()
  },
  deriveDataFromProps(nextProps) {
    this.updateAnimation(nextProps)
  },
  methods: {
    updateAnimation(props) {
      if (!props) props = this.props
      const { animation } = props
      this.setData({ derivedAnimation: animation })
    },
    onTouchStart(event) {
      if (this.props.disabled) return
      const { touches=[] } = event
      const [ touch ] = touches
      if (!touch) return
      const { clientY: startY } = touch
      this.setData({ startY, lastY: startY })
    },
    onTouchMove(event) {
      if (this.props.disabled) return
      const { touches=[] } = event
      const [ touch ] = touches
      if (!touch) return
      
      const { clientY } = touch
      const deltaY = clientY - this.data.startY
      
      if (this.props.onSwipeVertical) {
        this.props.onSwipeVertical(deltaY, event)
      }

      if (deltaY > 5 && deltaY < 75) {
        const swipeAnimation = my.createAnimation({
          timeFunction: 'ease',
          duration: 10,
        })
        swipeAnimation.translateY(deltaY + 'px').step() 
        this.setData({ swipeAnimation: swipeAnimation.export() })
      }
    },
    onTouchEnd(event) {
      if (this.props.disabled) return
      const { changedTouches=[] } = event
      const [ touch ] = changedTouches
      if (!touch) return
      const { clientY } = touch
      const deltaY = clientY - this.data.startY
      if (this.props.onSwipeEnd) {
        this.props.onSwipeEnd(deltaY, event)
      }
      this.setData({ swipeAnimation: null, derivedAnimation: null })
    },
  },
});
