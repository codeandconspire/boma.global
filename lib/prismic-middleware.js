// page types which all have featured fields used for links
var types = ['page']
var common = ['title', 'description', 'image']
var unique = {}

module.exports = middleware

function middleware (predicates, opts) {
  var fetchLinks = opts.fetchLinks = (opts.fetchLinks || [])

  for (let i = 0, len = types.length; i < len; i++) {
    fetchLinks.push(...common.map((field) => types[i] + '.' + field))
  }

  var keys = Object.keys(unique).sort()
  for (let i = 0, len = keys.length; i < len; i++) {
    fetchLinks.push(...unique[keys[i]].map((field) => keys[i] + '.' + field))
  }

  return function (err, response) {
    if (!err) return response
    // mask any error in the 400s as 404
    if (err.status < 400 || err.status >= 500) throw err
    err = new Error(err.message)
    err.status = 404
    throw err
  }
}
