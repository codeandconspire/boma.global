var html = require('choo/html')
var view = require('../components/view')
var { asText, HTTPError } = require('../components/base')

module.exports = view(landing, meta)

function landing (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('landing', state.params.landing, function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) return html`<div></div>`

        return html`
          <div class="u-container">
            landing page
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getByUID('landing', state.params.landing, function (err, doc) {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    if (doc.data.featured_image && doc.data.featured_image.url) {
      props['og:image'] = doc.data.featured_image.url
      props['og:image:width'] = doc.data.featured_image.dimensions.width
      props['og:image:heigh'] = doc.data.featured_image.dimensions.height
    }

    return props
  })
}
