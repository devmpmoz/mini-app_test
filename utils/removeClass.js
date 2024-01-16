/**
 * remove class name from Element
 * @param currentClass {string} current css class names
 * @param classRemove {string} css class name to be remove
 * @example
 * removeClass('className1 className2', 'className2')
 */
export default (currentClass = '', classRemove = '') => {
  const classNames = currentClass.split(' ')
  const index = classNames.indexOf(classRemove)
  if (index >= 0) {
    classNames.splice(index, 1)
  }
  return classNames.join(' ').trim()
}
