var html = require('choo/html')
var view = require('../components/view')
var asElement = require('prismic-element')
var serialize = require('../components/text/serialize')
var { asText, resolve } = require('../components/base')

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw err
        if (!doc) return html`<div></div>`

        return html`
          <div class="u-container">
            ${doc.data.title ? asElement(doc.data.title, resolve, serialize) : null}
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getSingle('homepage', function (err, doc) {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.image
    if (image && image.url) {
      Object.assign(props, {
        'og:image': image.url,
        'og:image:width': image.dimensions.width,
        'og:image:height': image.dimensions.height
      })
    }

    return props
  })
}
