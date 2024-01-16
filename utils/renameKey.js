/**
 * rename a JSON Object key name
 * @param obj {Object} JSON Object
 * @param oldKey {string} current key name
 * @param newKey {string} new key name
 * @example
 * renameKey(obj, '_id', 'id')
 */
export default (obj, oldKey = '', newKey = '') => {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey]
}
