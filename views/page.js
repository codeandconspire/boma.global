var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var Hero = require('../components/hero')
var embed = require('../components/embed')
var serialize = require('../components/text/serialize')
var { asText, resolve, srcset, HTTPError, memo } = require('../components/base')

module.exports = view(page('page'), meta('page'), 'page')
module.exports.landing = view(page('landing'), meta('landing'), 'landing')

function page (type) {
  return function (state, emit) {
    return html`
      <main class="View-main">
        ${state.prismic.getByUID(type, state.params.slug, (err, doc) => {
          if (err) throw HTTPError(404, err)
          if (!doc) {
            return html`
              <div>
                ${Hero.loading()}
              </div>
            `
          }

          var image = memo(function (img, sizes) {
            if (!img || !img.url) return null
            var sources = srcset(doc.data.image.url, sizes)
            return Object.assign({
              sizes: '100vw',
              srcset: sources,
              alt: doc.data.image.alt || '',
              src: sources.split(' ')[0]
            }, doc.data.image.dimensions)
          }, [doc.data.image, [400, 600, 900, 1400, 1800, [2600, 'q_50']]])

          var action = doc.data.action
          if (action && action.id && !action.isBroken) {
            var button = {
              href: resolve(action),
              text: action.data.call_to_action ? action.data.call_to_action : asText(action.data.title)
            }
          }

          return html`
            <div>
              ${state.cache(Hero, `hero-${doc.id}`).render({
                title: asText(doc.data.title),
                body: asElement(doc.data.description, resolve, serialize),
                image: image,
                action: button
              })}
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
                ${asElement(slice.primary.text, resolve, serialize)}
              </div>
            </div>
          `
        }
        case 'image': {
          if (!slice.primary.image.url) return null
          let size = slice.primary.width.toLowerCase()
          let large = size === 'large'

          let sources = srcset(slice.primary.image.url, [400, 600, 900, [1600, 'q_60'], [3000, 'q_35']])
          let attrs = Object.assign({
            sizes: large ? '100vw' : '(min-width: 800px) 43rem, 100vw',
            srcset: sources,
            class: large ? 'u-space2' : 'u-space1',
            src: sources.split(' ')[0],
            alt: slice.primary.image.alt || ''
          }, slice.primary.image.dimensions)

          var caption = slice.primary.caption ? asElement(slice.primary.caption) : slice.primary.image.copyright

          return html`
            <div class="${large ? 'u-md-container' : 'u-container'}">
              <figure class="Text u-${size}">
                <img ${attrs}>
                ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
              </figure>
            </div>
          `
        }
        case 'line': {
          return html`
            <div class="u-container"><hr class="u-medium u-space1" /></div>
          `
        }
        case 'video': {
          if (slice.primary.video.type !== 'video') return null
          let children = video(slice.primary.video)
          if (!children) return null

          let size = slice.primary.width.toLowerCase()
          let large = size === 'large'

          return html`
            <div class="${large ? 'u-md-container' : 'u-container'}">
              <figure class="Text u-${size}">
                <div class="u-space1">${children}</div>
              </div>
            </div>
          `
        }
        default: return null
      }
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

function meta (type) {
  return function (state) {
    return state.prismic.getByUID(type, state.params.slug, (err, doc) => {
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
}
