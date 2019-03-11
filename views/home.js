var html = require('choo/html')
var view = require('../components/view')
var hero = require('../components/hero')
var grid = require('../components/grid')
var card = require('../components/card')
var event = require('../components/event')
var compass = require('../components/compass')
var asElement = require('prismic-element')
var serialize = require('../components/text/serialize')
var { asText, resolve } = require('../components/base')

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw err
        if (!doc) return html`<div></div>`

        var featuredPosts = newsData.map(function (data) {
          return card(data)
        })

        var featuredEvents = eventData.map(function (data) {
          return event(data)
        })

        var compassPosts = compassPostData.map(function (data) {
          return card(data)
        })

        /*
        var featuredPosts = doc.data.featured_posts.map(function (data) {
          return card(data)
        })

        var featuredEvents = doc.data.featured_events.map(function (data) {
          return event(data)
        })
        */

        return html`
          <div>
            ${state.cache(hero, `hero-${doc.id}`).render()}

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
                    src: 'https://via.placeholder.com/1400x1000/4B2A96/FFFFFF'
                  },
                  children: compassPosts
                })}
              </div>
            </section>

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
      src: 'https://placehold.it/800x400'
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
      src: 'https://placehold.it/400x800'
    },
    video: true
  },
  {
    title: 'Salim Ismail Exponential Impact',
    body: '',
    location: 'São Paulo, Brazil',
    image: {
      src: 'https://placehold.it/400x800'
    }
  },
  {
    title: 'Forget preparing for the future, we need to create it',
    body: 'How new technologies are helping organic farms increase their margins—and propelling sustainability into the mainstream.',
    link: {
      href: '#/'
    },
    image: {
      src: 'https://placehold.it/400x800'
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
      src: 'https://via.placeholder.com/800x400/0000FF/808080'
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
      src: 'https://via.placeholder.com/400x800/0000FF/808080'
    }
  }
]
