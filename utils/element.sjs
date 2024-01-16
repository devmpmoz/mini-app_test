function classAttr(defaultClass, className) {
  let classAttribute = defaultClass

  if (className) {
    classAttribute += ` ${className}`
  }

  return classAttribute
}

export default {
  classAttr,
}
