function validatePropsMixin(component) {
  if (!component.validateProps) return {}
  const options = component.validateProps

  function runValidation(options, context) {
    if (!context.props) return
    for (const fieldName in options) {
      const ruleFn = options[fieldName]
      const value = context.props[fieldName]
      if (ruleFn && !ruleFn(value)) {
        console.error(`Invalid '${fieldName}' property with '${value}' value on ${context.is}`)
      } 
    }
  }

  return {
    didMount() {
      runValidation(options, this)
    },
    didUpdate() {
      runValidation(options, this)
    }
  }
}

export default validatePropsMixin