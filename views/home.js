var html = require('choo/html')
var parse = require('date-fns/parse')
var format = require('date-fns/format')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var isSameMonth = require('date-fns/is_same_month')
var view = require('../components/view')
var Hero = require('../components/hero')
var grid = require('../components/grid')
var card = require('../components/card')
var symbol = require('../components/base/symbol')
var glocal = require('../components/glocal')
var compass = require('../components/compass')
var connect = require('../components/connect')
var serialize = require('../components/text/serialize')
var { i18n, asText, resolve, loader, srcset, HTTPError, memo } = require('../components/base')

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) {
          return html`
            <div>
              ${Hero.loading({ image: true })}
              <div class="View-section">
                <div class="u-container">
                  ${glocal(html`
                    <div class="Text">
                      ${loader(80)}
                    </div>
                  `)}
                </div>
              </div>
            </div>
          `
        }

        var image = memo(function (url, sizes) {
          if (!url) return null
          var sources = srcset(doc.data.image.url, sizes)
          return Object.assign({
            sizes: '100vw',
            srcset: sources,
            alt: doc.data.image.alt || '',
            src: sources.split(' ')[0]
          }, doc.data.image.dimensions)
        }, [doc.data.image && doc.data.image.url, [400, 600, 900, 1400, 1800, [2600, 'q_70']]])

        return html`
          <div>
            ${state.cache(Hero, `hero-${doc.id}`).render({
              title: asText(doc.data.intro_text),
              words: doc.data.intro_words.map((item) => item.text),
              image
            })}

            <div class="View-section">
              <div class="u-container">
                ${glocal(html`
                  <div class="Text">
                    ${asElement(doc.data.description, resolve, serialize)}
                  </div>
                `)}
              </div>
            </div>

            <div class="u-container">
              ${state.prismic.getSingle('events', function (err, doc) {
                if (err) return null

                var items = []
                if (!doc) {
                  let opts = { background: true, location: true, date: true, body: false }
                  for (let i = 0; i < 4; i++) items.push(card.loading(opts))
                } else {
                  let events = doc.data.events
                    .filter((item) => item.start && item.link.url)
                    .map(function (item) {
                      return Object.assign({}, item, { start: parse(item.start) })
                    })
                    .sort((a, b) => a.start < b.start ? -1 : 1)

                  items = events.slice(0, 4).map(function (item) {
                    var date
                    if (item.end) {
                      let end = parse(item.end)
                      if (isSameMonth(item.start, end)) {
                        date = `${item.start.getDate()} – ${format(end, 'D MMMM')}`
                      } else {
                        date = `${format(item.start, 'D MMMM')} – ${format(end, 'D MMMM')}`
                      }
                    } else {
                      date = format(item.start, 'D MMMM')
                    }

                    return card({
                      background: memo(function (url, sizes) {
                        if (!url) return () => html`<div class="u-aspect16-9 u-bgOrange"></div>`
                        var sources = srcset(url, sizes, {
                          aspect: 9 / 16,
                          transforms: 'c_thumb'
                        })
                        return {
                          srcset: sources,
                          sizes: '(min-midth: 900px) 50vw, 100vw',
                          alt: item.image.alt || '',
                          src: sources.split(' ')[0],
                          width: item.image.dimensions.width,
                          height: item.image.dimensions.width * 9 / 16
                        }
                      }, [item.image.url, [400, [800, 'q_70'], [1200, 'q_50']]]),
                      title: asText(item.title),
                      date: {
                        datetime: item.start,
                        text: html`<span class="u-textBold u-textUppercase">${date}</span>`
                      },
                      location: [item.city, item.country].filter(Boolean).join(', '),
                      link: {
                        href: item.link.url
                      }
                    })
                  })
                }

                return html`
                  <section class="View-section">
                    <header class="View-sectionHead">
                      <h2>${text`Upcoming events`}</h2>
                      ${doc ? html`
                        <a href="${resolve(doc)}">
                          ${symbol.arrow(text`Show more`)}
                        </a>
                      ` : null}
                    </header>
                    ${grid({ size: { md: '1of2' } }, items)}
                  </section>
                `
              })}
            </div>

            ${doc.data.services_heading.length ? html`
              <section class="View-section">
                <div class="u-container">
                  ${compass({
                    title: asText(doc.data.services_heading),
                    image: memo(function (url, sizes) {
                      if (!url) return null
                      var sources = srcset(url, sizes, {
                        transforms: 'c_thumb',
                        aspect: 1
                      })
                      return {
                        src: sources.split(' ')[0],
                        sizes: '(min-width: 1000px) 660px, (min-width: 600px) 400px, 320px',
                        srcset: sources,
                        alt: doc.data.services_image.alt || '',
                        width: doc.data.services_image.dimensions.width,
                        height: doc.data.services_image.dimensions.width
                      }
                    }, [doc.data.services_image && doc.data.services_image.url, [320, 400, 800, [1200, 'q_70'], [1600, 'q_70']]]),
                    children: doc.data.services.map(function (item) {
                      return card({
                        title: asText(item.heading),
                        body: asElement(item.description, resolve, serialize),
                        image: memo(function (url, sizes) {
                          if (!url) return null
                          var sources = srcset(url, sizes)
                          return Object.assign({
                            sizes: '33vw',
                            srcset: sources,
                            alt: item.image.alt || '',
                            src: sources.split(' ')[0]
                          }, item.image.dimensions)
                        }, [item.image && item.image.url, [400, [800, 'q_70']]]),
                        link: (item.link.url || item.link.id) && !item.link.isBroken ? {
                          href: resolve(item.link),
                          text: item.link.type === 'Document' ? item.link.data.call_to_action : null
                        } : null
                      })
                    })
                  })}
                </div>
              </section>
            ` : null}

            <div class="u-container">
              ${state.prismic.get(
                Predicates.at('document.type', 'article'),
                {
                  pageSize: 3,
                  orderings: '[document.first_publication_date desc]'
                },
                function (err, response) {
                  if (err) return null

                  var items = []
                  if (!response) {
                    for (let i = 0; i < 4; i++) items.push(card.loading())
                  } else {
                    items = response.results.map(function (article) {
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
                  }

                  return html`
                    <section class="View-section">
                      <header class="View-sectionHead">
                        <h2>${text`Ideas`}</h2>
                        ${state.prismic.getSingle('discover', function (err, doc) {
                          if (err || !doc) return null
                          return html`
                            <a href="${resolve(doc)}">
                              ${symbol.arrow(text`Show more`)}
                            </a>
                          `
                        })}
                      </header>
                      ${grid({ size: { md: '1of3' }, carousel: true }, items)}
                    </section>
                  `
                }
              )}
            </div>

            <aside class="View-section">
              <div class="u-container">
                ${connect({
                  instagram: {
                    link: resolve(doc.data.instagram_link),
                    images: doc.data.instagram.map((item) => item.image)
                  },
                  newsletter: {
                    heading: asText(doc.data.newsletter_heading),
                    text: asElement(doc.data.newsletter_text, resolve, serialize),
                    ref: doc.data.newsletter_ref
                  }
                })}
              </div>
            </aside>
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
