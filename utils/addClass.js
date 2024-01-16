/**
 * append css class name to existing class names
 * @param currentClass {string} current css class names
 * @param newClass {string} new css class name
 * @example
 * addClass('className1 className2', 'className3')
 */
export default (currentClass = '', newClass = '') => {
  const classNames = currentClass.split(' ')
  if (classNames.indexOf(newClass) < 0) {
    classNames.push(newClass)
  }
  return classNames.join(' ').trim()
}
