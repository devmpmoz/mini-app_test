import validatePropsMixin from './mixins/validate-props'
import internalPropsMixin from './mixins/internal-props'

const MpesaComponent = (component) => {
  const { internalProps, exposeInputHandler = false } = component

  const data = {}

  const props = {
    onTap: null,
  }

  const methods = {
    onTap (e) {
      if (this.props.onTap) {
        this.props.onTap(e, this.props)
      }
    },
  }

  if (internalProps) {
    data.internalProps = {}
    data.initialProps = {...internalProps}
    const keys = Object.keys(internalProps)
    for (let i=0; i<keys.length; i++) {
      const key = keys[i]
      props[key] = null
    }
  }

  if (exposeInputHandler) {
    if (!component.props.onInput) props.onInput = null
    if (!component.props.onInputBlur) props.onInputBlur = null
    if (!component.props.onInputFocus) props.onInputFocus = null
    if (!component.methods.onInput) methods.onInput = function(e) { 
      const { onInput } = this.props
      if (onInput) onInput(e)
    }
    if (!component.methods.onInputBlur) methods.onInputBlur = function(e) { 
      const { onInputBlur } = this.props
      if (onInputBlur) onInputBlur(e)
    }
    if (!component.methods.onInputFocus) methods.onInputFocus = function(e) { 
      const { onInputFocus } = this.props
      if (onInputFocus) onInputFocus(e)
    }
  }

  const mixins = [
    validatePropsMixin(component),
    internalPropsMixin(component),
  ]

  component.data = component.data ? {...data, ...component.data} : {...data}
  component.props = component.props ? {...props, ...component.props} : {...props}
  component.methods = component.methods ? {...methods, ...component.methods} : {...methods}
  component.mixins = component.mixins ? [...mixins, ...component.mixins] : [...mixins]
  return component
}

export default MpesaComponent