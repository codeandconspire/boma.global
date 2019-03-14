var html = require('choo/html')
var parse = require('date-fns/parse')
var format = require('date-fns/format')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var isSameMonth = require('date-fns/is_same_month')
var View = require('../components/view')
var Hero = require('../components/hero')
var grid = require('../components/grid')
var Card = require('../components/card')
var nanoraf = require('nanoraf')
var symbol = require('../components/base/symbol')
var glocal = require('../components/glocal')
var button = require('../components/button')
var compass = require('../components/compass')
var connect = require('../components/connect')
var { i18n, asText, resolve, loader, srcset, HTTPError, memo, vh } = require('../components/base')

var text = i18n()

class Home extends View {
  load (el) {
    var slides = Array.from(el.querySelectorAll('.js-slide')).map(set)
    var onscroll = nanoraf(function check () {
      var { scrollY } = window
      for (let i = 0, len = slides.length; i < len; i++) {
        let item = slides[i]
        if (item && (scrollY > (item.top - vh() + 100))) {
          item.el.classList.add('is-visible')
          slides.splice(i, 1, null)
        }
      }
    })
    var onresize = nanoraf(function () {
      for (let i = 0, len = slides.length; i < len; i++) {
        if (slides[i]) slides[i] = set(slides[i].el)
      }
      onscroll()
    })

    var { scrollY } = window
    for (let i = 0, len = slides.length; i < len; i++) {
      let item = slides[i]
      slides[i].el.classList.add('is-initialized')
      if (scrollY > (item.top - vh() + 100)) {
        slides[i].el.classList.add('is-immediate')
        slides.splice(i, 1, null)
      } else if (item.initial) {
        item.el.classList.add('is-visible')
      }
    }

    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll, { passive: true })
    this.unload = function () {
      window.removeEventListener('resize', onresize)
      window.removeEventListener('scroll', onscroll)
    }

    function set (el) {
      var offset = el.offsetTop
      var parent = el
      while ((parent = parent.offsetParent)) offset += parent.offsetTop
      return {
        el: el,
        top: offset,
        initial: el.classList.contains('js-slideInitial')
      }
    }
  }

  update () {
    return true
  }

  createElement (state, emit) {
    return html`
      <main class="View-main">
        ${state.prismic.getSingle('homepage', function (err, doc) {
          if (err) throw HTTPError(404, err)
          if (!doc) {
            return html`
              <div>
                ${state.partial ? state.cache(Hero, `hero-${state.partial.id}`).render({
                  image: memo(function (url, sizes) {
                    if (!url) return null
                    return Object.assign({
                      alt: state.partial.data.image.alt || '',
                      src: srcset(state.partial.data.image.url, sizes).split(' ')[0]
                    }, state.partial.data.image.dimensions)
                  }, [state.partial.data.image && state.partial.data.image.url, [150]])
                }) : Hero.loading({ image: true })}
                <div class="u-space2">
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
          }, [doc.data.image && doc.data.image.url, [[640, 'q_60'], [750, 'q_60'], [1125, 'q_60'], [1440, 'q_50'], [2880, 'q_40'], [3840, 'q_30']]])

          return html`
            <div>
              ${state.cache(Hero, `hero-${doc.id}`).render({
                title: asText(doc.data.intro_text),
                words: doc.data.intro_words.map((item) => item.text),
                image
              })}

              <div class="u-space2">
                <div class="u-container View-slide js-slide js-slideInitial">
                  ${glocal(html`
                    <div class="Text">
                      ${asElement(doc.data.description, resolve, state.serialize)}
                      ${doc.data.description_link ? html`
                        <p>
                          ${button({
                            href: resolve(doc.data.description_link),
                            onclick: partial(doc.data.description_link),
                            text: doc.data.description_link.data.call_to_action || asText(doc.data.description_link.data.title)
                          })}
                        </p>
                      ` : null}
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
                    for (let i = 0; i < 4; i++) items.push(Card.loading(opts))
                  } else {
                    let events = doc.data.events
                      .filter((item) => item.start && item.link.url)
                      .map(function (item) {
                        return Object.assign({}, item, { start: parse(item.start) })
                      })
                      .sort((a, b) => a.start < b.start ? -1 : 1)

                    items = events.slice(0, 4).map(function (item, index) {
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

                      return html`
                        <div class="View-slide js-slide" style="animation-delay: ${index % 2 ? 100 : 0}ms;">
                          ${state.cache(Card, `${doc.id}-event-${index}`).render({
                            background: memo(function (url, sizes) {
                              if (!url) return () => html`<div class="u-aspect16-9 u-bgOrange"></div>`
                              var sources = srcset(url, sizes, {
                                aspect: 9 / 16,
                                transforms: 'c_thumb'
                              })
                              return {
                                srcset: sources,
                                sizes: '(min-midth: 1000px) 50vw, 100vw',
                                alt: item.image.alt || '',
                                src: sources.split(' ')[0],
                                width: item.image.dimensions.width,
                                height: item.image.dimensions.width * 9 / 16
                              }
                            }, [item.image.url, [[800, 'q_40'], [1000, 'q_40'], [1200, 'q_30']]]),
                            title: asText(item.title),
                            date: {
                              datetime: item.start,
                              text: html`<span class="u-textBold u-textUppercase">${date}</span>`
                            },
                            location: [item.city, item.country].filter(Boolean).join(', '),
                            link: {
                              href: item.link.url
                            }
                          })}
                        </div>
                      `
                    })
                  }

                  return html`
                    <section class="u-space2">
                      <header class="View-title View-slide js-slide">
                        <h2>${text`Upcoming events`}</h2>
                        ${doc ? html`
                          <a class="u-textLink" href="${resolve(doc)}">
                            ${symbol.arrow(text`Show more`)}
                          </a>
                        ` : null}
                      </header>
                      ${grid({ size: { lg: '1of2' }, slim: true }, items)}
                    </section>
                  `
                })}
              </div>

              ${doc.data.services_heading.length ? html`
                <section class="u-space3">
                  <div class="u-container View-slide js-slide">
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
                          sizes: '(min-width: 1000px) 660px, 400px',
                          srcset: sources,
                          alt: doc.data.services_image.alt || '',
                          width: doc.data.services_image.dimensions.width,
                          height: doc.data.services_image.dimensions.width
                        }
                      }, [doc.data.services_image && doc.data.services_image.url, [[400, 'q_50'], [800, 'q_50'], [1200, 'q_40'], [1500, 'q_40']]]),
                      children: doc.data.services.map(function (item) {
                        return Card({
                          title: asText(item.heading),
                          body: asElement(item.description, resolve, state.serialize),
                          link: (item.link.url || item.link.id) && !item.link.isBroken ? {
                            href: resolve(item.link),
                            onclick: item.link.id ? partial(item.link) : null,
                            text: item.link.type === 'Document' ? item.link.data.call_to_action : null
                          } : null
                        })
                      })
                    })}
                  </div>
                </section>
              ` : null}

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
                    for (let i = 0; i < 4; i++) items.push(Card.loading())
                  } else {
                    items = response.results.map(function (article, index) {
                      var image = article.data.featured_image
                      if (!image.url) image = article.data.image
                      var date = parse(article.first_publication_date)
                      return html`
                        <div class="View-slide js-slide" style="animation-delay: ${index * 100}ms;">
                          ${state.cache(Card, `${doc.id}-${article.id}`).render({
                            image: memo(function (url, sizes) {
                              if (!url) return null
                              var sources = srcset(url, sizes, {
                                transforms: 'c_thumb'
                              })
                              return Object.assign({
                                srcset: sources,
                                sizes: '(min-midth: 600px) 33vw, 80vw',
                                alt: image.alt || '',
                                src: sources.split(' ')[0]
                              }, image.dimensions)
                            }, [image && image.url, [[520, 'q_50'], [700, 'q_50'], [900, 'q_40'], [1200, 'q_30']]]),

                            title: asText(article.data.title),
                            date: {
                              datetime: date,
                              text: html`<span class="u-textBold u-textUppercase">${format(date, 'MMM D, YYYY')}</span>`
                            },
                            link: {
                              onclick: partial(article),
                              href: resolve(article),
                              visible: false
                            }
                          })}
                        </div>
                      `
                    })
                  }

                  return html`
                    <section class="u-space2">
                      <div class="u-container">
                        <header class="View-title View-slide js-slide">
                          <h2>${text`Ideas`}</h2>
                          ${state.prismic.getSingle('discover', function (err, doc) {
                            if (err || !doc) return null
                            return html`
                              <a class="u-textLink" href="${resolve(doc)}">
                                ${symbol.arrow(text`Show more`)}
                              </a>
                            `
                          })}
                        </header>
                      </div>
                      <div class="u-md-container">
                        ${grid({ size: { md: '1of3' }, carousel: true }, items)}
                      </div>
                    </section>
                  `
                }
              )}

              <div class="Sponsors View-slide u-space2 js-slide" style="overflow: hidden; background: rgb(var(--color-fog))">
                <div class="u-space2">
                  <div class="Text">
                    <h1 class="u-textCenter">In good company (logos)</h1>
                  </div>
                </div>
              </div>

              <aside class="u-space2">
                <div class="u-container View-slide js-slide">
                  ${connect({
                    instagram: {
                      link: resolve(doc.data.instagram_link),
                      images: doc.data.instagram.map((item) => item.image)
                    },
                    newsletter: {
                      heading: asText(doc.data.newsletter_heading),
                      text: asElement(doc.data.newsletter_text, resolve, state.serialize),
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

    // create onclick handler which emits pushState w/ partial info
    // obj -> fn
    function partial (doc) {
      return function (event) {
        emit('pushState', event.currentTarget.href, doc)
        event.preventDefault()
      }
    }
  }

  meta (state) {
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
}

module.exports = View.createClass(Home, 'home-view')
