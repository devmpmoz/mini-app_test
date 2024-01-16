Component({
  mixins: [],
  data: {
    slotVisible: false,
    transitionClass: '',
  },
  props: {
    name: '',
    visible: false,
    onLeave: null,
  },
  deriveDataFromProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this._waterfall([
        ['updateTransition', ['enter', 'enter-active']],
        ['updateTransition', ['enter-to', 'enter-active']],
        ['setData', { slotVisible: true }]
      ], () => {
        this.timer = setTimeout(() => {
          this.clearTransition()
        }, 300) 
      })
    } else if (this.props.visible && !nextProps.visible) {
      this._waterfall([
        ['updateTransition', ['leave', 'leave-active']],
        ['updateTransition', ['leave-to', 'leave-active']],
        ['setData', { slotVisible: false }]
      ], () => {
        this.timer = setTimeout(() => {
          this.clearTransition()
        }, 300) 
      })
    }
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {
    clearTimeout(this.timer)
  },
  methods: {
    _waterfall(tasks=[], callback) {
      let i = 0;
      const runTask = () => {
        if (i >= tasks.length) {
          if (callback) callback()
          return
        }
        const task = tasks[i]
        const [name, args] = task
        this[name](args, () => {
          i++
          runTask()
        })
      }
      runTask()
    },
    clearTransition(callback) {
      this.setData({ transitionClass: ''}, () => {
        if (callback) callback()
      })
    },
    updateTransition(types, callback) {
      const { name } = this.props
      const transitionClasses = []
      for (let i=0; i<types.length; i++) {
        transitionClasses.push(name + '-' + types[i])
      }
      const transitionClass = transitionClasses.join(' ')
      this.setData({ transitionClass }, () => {
        if (callback) callback()
      })
    },
  },
});
