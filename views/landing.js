var html = require('choo/html')
var view = require('../components/view')
var { asText } = require('../components/base')

module.exports = view(landing, meta)

function landing (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('landing', state.params.landing, function (err, doc) {
        if (err) throw err
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
