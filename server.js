if (!process.env.NOW) require('dotenv/config')

var jalla = require('jalla')
var dedent = require('dedent')
var body = require('koa-body')
var compose = require('koa-compose')
var { get, post } = require('koa-route')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')
var { resolve } = require('./components/base')
var imageproxy = require('./lib/cloudinary-proxy')

var REPOSITORY = 'https://bomaglobal.cdn.prismic.io/api/v2'

var app = jalla('index.js', {
  sw: 'sw.js',
  serve: Boolean(process.env.NOW) || process.env.NODE_ENV === 'production'
})

/**
 * Proxy image transform requests to Cloudinary
 * By running all transforms through our own server we can cache the response
 * on our edge servers (Cloudinary) saving on costs. Seeing as Cloudflare has
 * free unlimited cache and Cloudinary does not, we will only be charged for
 * the actual image transforms, of which the first 25 000 are free
 */
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (ctx.querystring) uri += `?${ctx.querystring}`
  var stream = await imageproxy(type, transform, uri)
  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, stream.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = stream
}))

/**
 * Purge Cloudflare cache whenever content is published to Prismic
 */
app.use(post('/api/prismic-hook', compose([body(), function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
  return new Promise(function (resolve, reject) {
    purge(function (err, response) {
      if (err) return reject(err)
      ctx.type = 'application/json'
      ctx.body = {}
      resolve()
    })
  })
}])))

/**
 * Handle Prismic previews
 * Capture the preview token, setting it as a cookie and redirect to the
 * document being previewed. The Prismic library will pick up the cookie and use
 * it for fetching content.
 */
app.use(get('/api/prismic-preview', async function (ctx) {
  var token = ctx.query.token
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  var href = await api.previewSession(token, resolve, '/')
  var expires = app.env === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * 12))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, {
    expires: expires,
    httpOnly: false,
    path: '/'
  })
  ctx.redirect(href)
}))

/**
 * Expose common constants on state for use in templates
 */
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  ctx.state.repository = REPOSITORY
  ctx.state.origin = ctx.origin
  return next()
})

/**
 * Capture requests for pages at the site root and redirect pages with a parent
 * to their proper url
 */
app.use(get('/:slug', async function (ctx, slug, next) {
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  try {
    let doc = await api.getByUID('page', slug)
    if (!doc.data.parent || !doc.data.parent.id) return next()
    ctx.redirect(resolve(doc))
  } catch (err) {
    return next()
  }
}))

/**
 * Disallow robots anywhere but in production
 */
app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${app.env === 'production' ? '' : '/'}
  `
}))

/**
 * Set cache headers for HTML pages
 * By caching HTML on our edge servers (Cloudflare) we keep response times and
 * hosting costs down. The `s-maxage` property tells Cloudflare to cache the
 * response for a month whereas we set the `max-age` to cero to prevent clients
 * from caching the response
 */
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  var previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  } else {
    ctx.state.ref = null
    if (app.env !== 'development') {
      ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 30}, max-age=0`)
    }
  }

  return next()
})

/**
 * Purge Cloudflare cache when starting production server
 */
app.listen(process.env.PORT || 8080, function () {
  if (process.env.NOW && app.env === 'production') {
    purge(['/sw.js'], function (err) {
      if (err) app.emit('error', err)
    })
  }
})
