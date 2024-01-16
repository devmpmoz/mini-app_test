function internalPropsMixin(component) {
  const { internalProps, lockedInternalProps=[] } = component
  if (!internalProps) return {}

  const _lockedInternalProps = {}
  for (let i=0; i<lockedInternalProps.length; i++) {
    _lockedInternalProps[lockedInternalProps[i]] = true
  }

  function derivedProps(context, props) {
    const internalProps = props ? {...props} : {...context.props}
    context.setData({ internalProps })
  }

  return {
    data: {
      _lockedInternalProps: {..._lockedInternalProps},
    },
    onInit() {
      derivedProps(this, internalProps)
    },
    didMount() {
      derivedProps(this, internalProps)
    },
    deriveDataFromProps(nextProps) {
      const props = {}
      const keys = Object.keys(nextProps)
      for (let i=0; i<keys.length; i++) {
        const key = keys[i]
        const isLocked = this.data._lockedInternalProps[key]
        if (isLocked || nextProps[key] === null || nextProps[key] === undefined) {
          props[key] = this.data.internalProps[key]
        } else {
          props[key] = nextProps[key]
        }
      }
      derivedProps(this, props)
    }
  }
}

export default internalPropsMixin