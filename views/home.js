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
var spur = require('../components/spur')
var glocal = require('../components/glocal')
var Quotes = require('../components/quotes')
var person = require('../components/person')
var compass = require('../components/compass')
var connect = require('../components/connect')
var principles = require('../components/principles')
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

            <div class="View-section">
              ${state.cache(Quotes, `quotes-${doc.id}`).render(quotesData)}
            </div>

            <div class="View-section">
              ${principles(principlesData)}
            </div>

            ${spur({
              title: 'Are ready to challenge business as usual and drive positive impact?',
              action: {
                text: 'Find your closest Boma',
                href: '#/'
              },
              image: {
                src: 'https://via.placeholder.com/1400x1000/0000FF'
              }
            })}

            ${spur({
              title: 'Are ready to challenge business as usual and drive positive impact?',
              action: {
                text: 'Contact us',
                href: '#/'
              }
            })}

            ${(function () {
              var peopleItems = peopleData.map(function (data) {
                return person(data)
              })

              return html`
                <div class="View-section">
                  <div class="u-container">
                    <header class="View-sectionHead View-sectionHead--center">
                      <h2>${text`Founders`}</h2>
                    </header>
                    ${grid({
                      size: {
                        sm: '1of2',
                        md: '1of3',
                        lg: peopleItems.length > 3 ? '1of4' : '1of3'
                      }
                    }, peopleItems)}
                  </div>
                </div>
              `
            }())}
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

var peopleData = [
  {
    title: 'Lara Stein',
    body: 'Founder, TEDx; Global Expansion Strategist, Singularity University',
    image: {
      src: 'https://via.placeholder.com/400x400/0000FF'
    }
  },
  {
    title: 'Kaila Colbin',
    body: 'Curator, TEDxChristchurch; Curator, TEDxScottBase; Curator, SingularityU New Zealand Summit; Curator, SingularityU Australia Summit; Co-founder, Ministry of Awesome',
    image: {
      src: 'https://via.placeholder.com/400x400/0000FF'
    },
    href: '#/'
  },
  {
    title: 'Lara Stein',
    body: 'Founder, TEDx; Global Expansion Strategist, Singularity University'
  },
  {
    title: 'Lara Stein',
    body: 'Founder, TEDx; Global Expansion Strategist, Singularity University',
    image: {
      src: 'https://via.placeholder.com/400x400/0000FF'
    },
    href: '#/'
  },
  {
    title: 'Lara Stein',
    body: 'Founder, TEDx; Global Expansion Strategist, Singularity University',
    community: 'Stockholm'
  }
]

var principlesData = [
  {
    title: 'Embrace Complexity',
    body: 'We’re heading into a future with no simple answers. Technology, for example, has brought about extraordinary progress, but it has also created unprecedented challenges. We need to accept these complexities fearlessly if we want to make a better future for everyone.'
  },
  {
    title: 'Be robust and credible',
    body: 'While nobody knows what the future holds, our work is evidence-based and defensible.'
  },
  {
    title: 'Question dogma',
    body: 'We embrace new evidence and are willing to challenge our own status quo. We aren’t inflexible champions of technology, and we aren’t attached to a particular model of society.'
  },
  {
    title: 'Be inclusive',
    body: 'Our events and programs welcome people from all sectors of society, and we work hard to make them accessible to a broad range of people.'
  }
]
