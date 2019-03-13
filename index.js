var choo = require('choo')
var app = choo({ hash: false })
var middleware = require('./lib/prismic-middleware')
var REPOSITORY = 'https://bomaglobal.cdn.prismic.io/api/v2'

app.state.origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : process.env.npm_package_now_alias

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('./stores/reset'))
app.use(require('./stores/ui'))
app.use(require('./stores/navigation'))
app.use(require('./stores/prismic')({ repository: REPOSITORY, middleware }))
app.use(require('choo-meta')({ origin: app.state.origin }))
app.use(require('choo-service-worker')('/sw.js'))

app.route('/', require('./views/home'))
app.route('/community', require('./views/community'))
app.route('/participate', require('./views/events'))
app.route('/discover', require('./views/discover'))
app.route('/community/:slug', require('./views/catchall'))
app.route('/participate/:slug', require('./views/catchall'))
app.route('/discover/:slug', require('./views/catchall'))
app.route('/*', require('./views/catchall'))

try {
  module.exports = app.mount('body')
  // remove parse guard added in header
  window.onerror = null
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}
