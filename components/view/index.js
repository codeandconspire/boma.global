var assert = require('assert')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var error = require('./error')
var Header = require('../header')
var Footer = require('../footer')
var Player = require('../embed/player')
var PrismicToolbar = require('../prismic-toolbar')
var { i18n, asText, memo, resolve } = require('../base')

if (typeof window !== 'undefined') {
  require('focus-visible')

  // Enable active states in iOS
  document.addEventListener('touchstart', function () {}, false)
}

var text = i18n()

var DEFAULT_TITLE = text`SITE_NAME`

module.exports = View

// view constructor doubles as view factory
// if not called with the `new` keyword it will just return a wrapper function
// (str|fn, fn?) -> View|fn
function View (view, meta) {
  if (!(this instanceof View)) return createView(view, meta)
  var id = view
  assert(typeof id === 'string', 'View: id should be type string')
  Component.call(this, id)
  this.createElement = createView(this.createElement, this.meta)
}

View.prototype = Object.create(Component.prototype)
View.prototype.constructor = View
View.prototype.meta = function () {
  throw new Error('View: meta should be implemented')
}
View.createView = createView
View.createClass = createClass

function createClass (Class, id) {
  return function (state, emit) {
    return state.cache(Class, id).render(state, emit)
  }
}

function createView (view, meta) {
  return function (state, emit) {
    var self = this

    return state.prismic.getSingle('website', function (err, doc) {
      var children

      try {
        if (err) throw err
        children = view.call(self, state, emit)
        let next = meta ? meta.call(self, state) : {}

        if (next && next.title && next.title !== DEFAULT_TITLE) {
          next.title = `${next.title} – ${DEFAULT_TITLE}`
        }

        var defaults = {
          title: doc ? asText(doc.data.title) : `${text`Loading`} – ${DEFAULT_TITLE}`,
          description: doc ? asText(doc.data.description) : null
        }

        if (doc && doc.data.featured_image && doc.data.featured_image.url) {
          defaults['og:image'] = doc.data.featured_image.url
          defaults['og:image:width'] = doc.data.featured_image.dimensions.width
          defaults['og:image:height'] = doc.data.featured_image.dimensions.height
        }

        emit('meta', Object.assign(defaults, next))
      } catch (err) {
        err.status = state.offline ? 503 : err.status || 500
        children = error(err)
        emit('meta', { title: `${text`Oops`} – ${DEFAULT_TITLE}` })
      }

      var menu = memo(function () {
        if (!doc) return []
        return doc.data.main_menu.map(branch).filter(Boolean)
      }, [doc && doc.id, 'menu'])

      var footer = memo(function () {
        if (!doc) return null
        return {
          social: doc.data.social_links
            .filter((item) => item.link.url)
            .map((item) => ({
              type: item.type,
              href: item.link.url
            })),
          legal: doc.data.legal_links
            .filter((item) => item.link.id && !item.link.isBroken)
            .map((item) => ({
              href: resolve(item.link),
              label: item.link.data.call_to_action || asText(item.link.data.title)
            })),
          menu: doc.data.footer_menu.map(branch).filter(Boolean)
        }
      }, [doc && doc.id, 'footer'])

      return html`
        <body class="View ${state.ui.openNavigation ? 'is-overlayed' : ''}" id="view">
          <script type="application/ld+json">${raw(JSON.stringify(linkedData(state)))}</script>
          ${state.cache(Header, 'header').render(state.href, menu)}
          ${children}
          ${state.cache(Footer, 'footer').render(footer)}
          ${Player.render()}
          ${state.cache(PrismicToolbar, 'prismic-toolbar').placeholder(state.href)}
        </body>
      `

      // format document as schema-compatible linked data table
      // obj -> obj
      function linkedData (state) {
        return {
          '@context': 'http://schema.org',
          '@type': 'Organization',
          name: DEFAULT_TITLE,
          url: state.origin,
          logo: state.origin + '/icon.png'
        }
      }
    })
  }
}

// construct menu branch
// obj -> obj
function branch (slice) {
  var { primary, items } = slice
  if (slice.slice_type !== 'menu_item') return null
  if (!primary.link.id || primary.link.isBroken) return null
  return {
    label: primary.label || primary.link.data.call_to_action,
    href: resolve(primary.link),
    children: items.map(function (item) {
      if (!item.link.id || item.link.isBroken) return null
      return {
        label: item.label || item.link.data.call_to_action,
        href: resolve(item.link),
        description: asText(item.description)
      }
    }).filter(Boolean)
  }
}
