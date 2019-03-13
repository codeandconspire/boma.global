var html = require('choo/html')
var parse = require('date-fns/parse')
var format = require('date-fns/format')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var Hero = require('../components/hero')
var grid = require('../components/grid')
var card = require('../components/card')
var highlight = require('../components/highlight')
var serialize = require('../components/text/serialize')
var { i18n, asText, srcset, HTTPError, memo, resolve } = require('../components/base')

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('discover', function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) {
          let items = []
          for (let i = 0; i < 6; i++) items.push(card.loading({ date: true }))
          return html`
            <div>
              ${Hero.loading({ center: true, image: true })}
              <div class="u-container">
                ${highlight.loading()}
                <div class="u-space2">
                  ${grid({ size: { md: '1of3', sm: '1of2' } }, items)}
                </div>
              </div>
            </div>
          `
        }

        var image = memo(function (url, sizes) {
          if (!url) return null
          var sources = srcset(url, sizes)
          return Object.assign({
            sizes: '100vw',
            srcset: sources,
            alt: doc.data.image.alt || '',
            src: sources.split(' ')[0]
          }, doc.data.image.dimensions)
        }, [doc.data.image.url, [400, 600, 900, 1400, 1800, [2600, 'q_70']]])

        var featured = doc.data.featured_articles.map(function (item, index) {
          if (!item.link.id || item.link.isBroken) return null
          var title = asText(item.link.data.title)
          var image = item.link.data.featured_image
          if (!image || !image.url) image = item.link.data.image

          return highlight({
            direction: index % 2 ? 'right' : 'left',
            title: title,
            body: asElement(item.link.data.description, resolve, serialize),
            action: {
              href: resolve(item.link),
              text: text`Read more`
            },
            image: memo(function (url, sizes) {
              if (!url) return null
              var sources = srcset(url, sizes, {
                aspect: 1,
                transforms: 'c_thumb'
              })
              return {
                srcset: sources,
                sizes: '(min-width: 600px) 50vw, 100vw',
                alt: image.alt || '',
                src: sources.split(' ')[0],
                width: image.dimensions.width,
                height: image.dimensions.width
              }
            }, [image.url, [300, 400, 600, [900, 'q_70'], [1200, 'q_50']]])
          })
        }).filter(Boolean)

        var opts = {
          pageSize: 100,
          orderings: '[document.first_publication_date desc]'
        }
        var predicates = [Predicates.at('document.type', 'article')]
        doc.data.featured_articles.forEach(function (item) {
          if (item.link.id) {
            predicates.push(Predicates.not('document.id', item.link.id))
          }
        })
        var articles = state.prismic.get(predicates, opts, function (err, response) {
          if (err) return null
          if (!response) {
            let items = []
            for (let i = 0; i < 6; i++) items.push(card.loading({ date: true }))
            return articles
          }
          return response.results.map(function (article) {
            var image = article.data.featured_image
            if (!image.url) image = article.data.image
            var date = parse(article.first_publication_date)
            return card({
              image: memo(function (url, sizes) {
                if (!url) return null
                var sources = srcset(url, sizes, {
                  transforms: 'c_thumb'
                })
                return Object.assign({
                  srcset: sources,
                  sizes: '(min-midth: 600px) 33vw, 100vw',
                  alt: image.alt || '',
                  src: sources.split(' ')[0]
                }, image.dimensions)
              }, [image && image.url, [400, [800, 'q_70'], [1200, 'q_50']]]),
              title: asText(article.data.title),
              date: {
                datetime: date,
                text: html`<span class="u-textBold u-textUppercase">${format(date, 'MMM D, YYYY')}</span>`
              },
              link: {
                href: resolve(article),
                visible: false
              }
            })
          })
        })

        return html`
          <div>
            ${state.cache(Hero, `hero-${doc.id}`).render({
              title: asText(doc.data.title),
              image: image
            })}
            <div class="u-container">
              ${featured}
              <div class="u-space2">
                ${articles ? grid({ size: { md: '1of3', sm: '1of2' } }, articles) : null}
              </div>
            </section>
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getSingle('discover', function (err, doc) {
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
