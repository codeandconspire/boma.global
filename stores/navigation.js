var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var { resolve } = require('../components/base')
var serialize = require('../components/text/serialize')

module.exports = navigation

function navigation (state, emitter) {
  state.partial = null

  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  emitter.prependListener('pushState', function (href, next) {
    if (next) state.partial = next
    else state.partial = null
  })

  state.serialize = function (type, element, content, children) {
    if (type === Elements.hyperlink) {
      if (element.data.id) {
        return serializeHyperlink(element, children, function (event) {
          emitter.emit('pushState', event.currentTarget.href, element.data)
          event.preventDefault()
        })
      }
      return serializeHyperlink(element, children)
    }
    return serialize(type, element, content, children)
  }

  function onnavigate (href, opts = {}) {
    if (pathname(href) !== state.href) {
      if (!opts.persistScroll) {
        window.requestAnimationFrame(function () {
          window.scrollTo(0, 0)
        })
      }
    }
  }
}

// get link
// (obj, arr) -> Element
function serializeHyperlink (element, children, onclick) {
  var attrs = { href: resolve(element.data) }
  if (typeof onclick === 'function') attrs.onclick = onclick
  if (element.data.target && element.data.target === '_blank') {
    attrs.target = '_blank'
    attrs.rel = 'noopener noreferrer'
  }
  return html`<a ${attrs}>${children}</a>`
}

// reduce href to only its pathname
// str -> str
function pathname (href) {
  return href
    .replace(/^https?:\/\/.+?\//, '/')
    .replace(/\?.+$/, '')
    .replace(/\/$/, '')
    .replace(/#.+$/, '')
}
