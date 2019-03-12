var html = require('choo/html')
var view = require('../components/view')
var { asText, HTTPError } = require('../components/base')

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('page', state.params.page, (err, doc) => {
        if (err) throw HTTPError(404, err)
        if (!doc) return html`<div></div>`

        return html`
          <div class="u-container">
            los pago
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getByUID('page', state.params.page, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image
    if (!image.url) image = doc.data.image
    if (image.url) {
      Object.assign(props, {
        'og:image': image.url,
        'og:image:width': image.dimensions.width,
        'og:image:height': image.dimensions.height
      })
    }

    return props
  })
}
