var html = require('choo/html')
var parse = require('date-fns/parse')
var format = require('date-fns/format')
var asElement = require('prismic-element')
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
var { i18n, asText, resolve, loader, srcset, HTTPError } = require('../components/base')

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

        var featuredPosts = newsData.map(function (data) {
          return card(data)
        })

        var featuredEvents = eventData.map(function (data) {
          return event(data)
        })

        var compassPosts = compassPostData.map(function (data) {
          return card(data)
        })

        var image = null
        if (doc.data.image.url) {
          let sources = srcset(doc.data.image.url, [400, 600, 900, 1400, 1800, [2600, 'q_70']])
          image = Object.assign({
            sizes: '100vw',
            srcset: sources,
            alt: doc.data.image.alt || '',
            src: sources.split(' ')[0]
          }, doc.data.image.dimensions)
        }

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
                    var sources = item.image.url ? srcset(
                      item.image.url,
                      [400, [800, 'q_70'], [1200, 'q_50']],
                      { aspect: 9 / 16, transforms: 'c_thumb' }
                    ) : null

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
                      background: item.image.url ? {
                        srcset: sources,
                        sizes: '(min-midth: 900px) 50vw, 100vw',
                        alt: item.image.alt || '',
                        src: sources.split(' ')[0]
                      } : () => html`
                        <div class="u-aspect16-9 u-bgOrange"></div>
                      `,
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
                    <div class="Text u-sizeFull u-flex u-justifySpaceBetween u-spaceB4">
                      <h2 class="Text-h4">${text`Upcoming events`}</h2>
                      ${doc ? html`<a class="Text-h4" href="${resolve(doc)}">${text`Show more`}</a>` : null}
                    </div>
                    ${grid({ size: { md: '1of2' } }, items)}
                  </section>
                `
              })}
            </div>

            <section class="View-section">
              <div class="u-container">
                ${grid({
                  size: {
                    md: '1of2',
                    lg: '1of3'
                  }
                }, featuredPosts)}
              </div>
            </section>

            <section class="View-section">
              <div class="u-container">
                <header class="View-sectionHead">
                  <h2>Upcoming events</h2>
                  <a href="#/">
                    <span>Show more</span>
                    <svg class="" width="7" height="11" version="1" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </a>
                </header>
                ${grid({
                  size: {
                    md: '1of2'
                  }
                }, featuredEvents)}
              </div>
            </section>

            <section class="View-section">
              <div class="u-container">
                ${compass({
                  title: 'We support leaders & teams in the necessary transformation of organizations.',
                  image: {
                    src: 'https://via.placeholder.com/1400x1000/0000FF'
                  },
                  children: compassPosts
                })}
              </div>
            </section>

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
      title: 'Watch video'
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
    }
  ]
}
