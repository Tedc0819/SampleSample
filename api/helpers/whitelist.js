module.exports = function whiteList({ obj, filter }) {
  return filter.reduce((prev, key) => (obj[key] !== undefined ? { ...prev, [key]: obj[key] } : prev), {})
}
