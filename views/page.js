var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var intro = require('../components/intro')
var embed = require('../components/embed')
var { asText, resolve, srcset, HTTPError } = require('../components/base')

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('page', state.params.page, (err, doc) => {
        if (err) throw HTTPError(404, err)
        if (!doc) {
          return html`
            <div>
              ${intro.loading({
                center: true,
                image: true
              })}
            </div>
          `
        }

        var props = {
          center: true,
          title: asText(doc.data.title),
          body: asElement(doc.data.description, resolve, state.serialize)
        }

        if (doc.data.image) {
          let sources = srcset(doc.data.image.url, [400, 600, 900, [1600, 'q_60'], [2200, 'q_60']])
          props.image = Object.assign({
            alt: doc.data.image_caption || doc.data.image.alt,
            caption: doc.data.image_caption,
            sizes: '(min-width: 65rem) 65rem, 100vw',
            srcset: sources,
            src: sources.split(' ')[0],
            original: doc.data.image.url
          }, doc.data.image.dimensions)
        }
        return html`
          <div>
            ${intro(props)}
            ${doc.data.body.map(asSlice)}
          </div>
        `
      })}
    </main>
  `

  // render slice as element
  // (obj, num) -> Element
  function asSlice (slice, index, list) {
    switch (slice.slice_type) {
      case 'text': {
        if (!slice.primary.text.length) return null
        return html`
          <div class="u-container">
            <div class="Text">
              ${asElement(slice.primary.text, resolve, state.serialize)}
            </div>
          </div>
        `
      }
      case 'image': {
        if (!slice.primary.image.url) return null
        var size = slice.primary.width
        let attrs

        if (!/\.gif$/.test(slice.primary.image.url)) {
          let sources = srcset(slice.primary.image.url, [400, 600, 900, [1600, 'q_60'], [3000, 'q_50']])
          attrs = Object.assign({
            sizes: '100vw',
            srcset: sources,
            src: sources.split(' ')[0],
            alt: slice.primary.image.alt || ''
          }, slice.primary.image.dimensions)
        } else {
          attrs = Object.assign({
            src: slice.primary.image.url,
            alt: slice.primary.image.alt || ''
          }, slice.primary.image.dimensions)
        }

        var caption = slice.primary.caption ? asElement(slice.primary.caption) : slice.primary.image.copyright

        return html`
          <div class="u-container">
            <figure class="Text u-${size.toLowerCase()}">
              <img ${attrs}>
              ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
            </figure>
          </div>
        `
      }
      case 'line': {
        return html`
          <div class="u-container"><hr class="u-medium u-space" /></div>
        `
      }
      case 'video': {
        if (slice.primary.video.type !== 'video') return null
        let children = video(slice.primary.video)
        if (!children) return null
        return html`
          <div class="u-container"></div>
            <div class="Text u-medium">
              <div class="Text-block">${children}</div>
            </div>
          </div>
        `
      }
      default: return null
    }
  }
}

// map props to embed player
// obj -> Element
function video (props) {
  var id = embed.id(props)
  if (!id) return null

  var provider = props.provider_name.toLowerCase()
  return embed({
    url: props.embed_url,
    title: props.title,
    src: `/media/${provider}/w_900/${id}`,
    width: props.thumbnail_width,
    height: props.thumbnail_height,
    sizes: '100vw',
    srcset: srcset(id, [400, 900, 1800, [2600, 'q_50'], [3600, 'q_30']], { type: provider })
  })
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
