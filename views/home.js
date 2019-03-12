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
var event = require('../components/event')
var glocal = require('../components/glocal')
var compass = require('../components/compass')
var Quotes = require('../components/quotes')
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
              ${Hero.loading()}
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

        var image = memo(function (url) {
          if (!url) return null
          var sources = srcset(
            doc.data.image.url,
            [400, 600, 900, 1400, 1800, [2600, 'q_70']]
          )
          return Object.assign({
            sizes: '100vw',
            srcset: sources,
            alt: doc.data.image.alt || '',
            src: sources.split(' ')[0]
          }, doc.data.image.dimensions)
        }, [doc.data.image.url])

        return html`
          <div>
            ${state.cache(Hero, `hero-${doc.id}`).render(
              asText(doc.data.intro_text),
              doc.data.intro_words.map((item) => item.text),
              image
            )}

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
                      background: memo(function (url) {
                        if (!url) return () => html`<div class="u-aspect16-9 u-bgOrange"></div>`
                        var sources = srcset(
                          url,
                          [400, [800, 'q_70'], [1200, 'q_50']],
                          { aspect: 9 / 16, transforms: 'c_thumb' }
                        )
                        return {
                          srcset: sources,
                          sizes: '(min-midth: 900px) 50vw, 100vw',
                          alt: item.image.alt || '',
                          src: sources.split(' ')[0],
                          width: item.image.dimensions.width,
                          height: item.image.dimensions.width * 9 / 16
                        }
                      }, [item.image.url]),
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
                          <span>${text`Show more`}</span>
                          <svg class="" width="7" height="11" version="1">
                            <path d="M1 9l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
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
                    image: memo(function (url) {
                      if (!url) return null
                      var sources = srcset(
                        url,
                        [320, 400, 800, [1200, 'q_70'], [1600, 'q_70']],
                        { transforms: 'c_thumb', aspect: 1 }
                      )
                      return {
                        src: sources.split(' ')[0],
                        sizes: '(min-width: 1000px) 660px, (min-width: 600px) 400px, 320px',
                        srcset: sources,
                        alt: doc.data.services_image.alt || '',
                        width: doc.data.services_image.dimensions.width,
                        height: doc.data.services_image.dimensions.width
                      }
                    }, [doc.data.services_image.url]),
                    children: doc.data.services.map(function (item) {
                      return card({
                        title: asText(item.heading),
                        body: asElement(item.description, resolve, serialize),
                        image: memo(function (url) {
                          if (!url) return null
                          var sources = srcset(url, [400, [800, 'q_70']])
                          return Object.assign({
                            sizes: '33vw',
                            srcset: sources,
                            alt: item.image.alt || '',
                            src: sources.split(' ')[0]
                          }, item.image.dimensions)
                        }, [item.image.url]),
                        link: (item.link.url || item.link.id) && !item.link.isBroken ? {
                          href: resolve(item.link),
                          text: item.link.type === 'Document' ? item.link.data.cta : null
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
                        image: memo(function (url) {
                          if (!url) return null
                          var sources = srcset(
                            url,
                            [400, [800, 'q_70'], [1200, 'q_50']],
                            { transforms: 'c_thumb' }
                          )
                          return Object.assign({
                            srcset: sources,
                            sizes: '(min-midth: 600px) 33vw, 100vw',
                            alt: image.alt || '',
                            src: sources.split(' ')[0]
                          }, image.dimensions)
                        }, [image.url]),
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
                              <span>${text`Show more`}</span>
                              <svg class="" width="7" height="11" version="1">
                                <path d="M1 9l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
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

            <div class="View-section">
              ${state.cache(Quotes, `quotes-${doc.id}`).render(quotesData)}
            </div>
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

/* TODO: Remove dummy data */

var newsData = [
  {
    date: {
      text: '10-11 April',
      datetime: ''
    },
    title: 'Grow 2019 agri summit',
    body: '',
    location: 'Christchurch, New Zealand',
    link: {
      href: '#/'
    },
    image: {
      src: 'https://via.placeholder.com/800x400/0000FF'
    }
  },
  {
    title: 'Video title',
    body: 'Common outcome—to shift perspective, to learn, and to evolve.',
    link: {
      href: '#/',
      text: 'Watch video'
    },
    image: {
      src: 'https://via.placeholder.com/400x800/0000FF'
    },
    video: true
  },
  {
    title: 'Salim Ismail Exponential Impact',
    body: '',
    location: 'São Paulo, Brazil',
    image: {
      src: 'https://via.placeholder.com/400x800/0000FF'
    }
  },
  {
    title: 'Forget preparing for the future, we need to create it',
    body: 'How new technologies are helping organic farms increase their margins—and propelling sustainability into the mainstream.',
    link: {
      href: '#/'
    },
    image: {
      src: 'https://via.placeholder.com/400x800/0000FF'
    },
    community: false
  }
]

var compassPostData = [
  {
    title: 'Summits',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua.',
    link: {
      href: '#/',
      title: 'About Summits'
    }
  },
  {
    title: 'Institute',
    body: 'Penatibus et magnis dis parturient montes nascetur ridiculus mus. Vulputate mi sit. Adipiscing elit ut aliquam purus.',
    link: {
      href: '#/',
      title: 'About Boma Institute'
    }
  },
  {
    title: 'Boma Club',
    body: 'Lectus arcu bibendum at varius. Morbi tristique senectus et netus. Id semper risus in hendrerit gravida rutrum.',
    link: {
      href: '#/',
      title: 'About Boma Club'
    }
  }
]

var eventData = [
  {
    date: {
      text: '10-11 April',
      datetime: ''
    },
    title: 'Grow 2019 agri summit',
    location: 'Christchurch, New Zealand',
    link: {
      href: '#/'
    },
    image: {
      src: 'https://via.placeholder.com/800x400/0000FF'
    }
  },
  {
    title: 'Boma France Campfire: What if?',
    link: {
      href: '#/'
    }
  },
  {
    date: {
      text: '25 April',
      datetime: ''
    },
    title: 'Boma Germany Summit',
    location: 'Berlin, Germany',
    link: {
      href: '#/'
    },
    image: {
      src: 'https://via.placeholder.com/400x800/0000FF'
    }
  }
]

var quotesData = {
  image: {
    src: 'https://via.placeholder.com/1400x1000/0000FF'
  },
  content: [
    {
      body: 'A few days with the Boma New Zealand team has given me the freedom to imagine the unimaginable for my business. This is a fantastic programme for any leader trying to achieve aspirational goals in a world of exponential change.',
      name: 'Susan Nemeth',
      title: 'Director, COO and CFO, Aportio Technologies'
    },
    {
      body: 'A few days with the Boma New Zealand team has given me the freedom to imagine the unimaginable for my business. This is a fantastic programme for any leader trying to achieve aspirational goals in a world of exponential change.',
      name: 'Susan Nemeth',
      title: 'Director, COO and CFO, Aportio Technologies'
    },
    {
      body: 'A few days with the Boma New Zealand team has given me the freedom to imagine the unimaginable for my business. This is a fantastic programme for any leader trying to achieve aspirational goals in a world of exponential change.',
      name: 'Susan Nemeth',
      title: 'Director, COO and CFO, Aportio Technologies'
    }
  ]
}
