var html = require('choo/html')
var view = require('../components/view')
var hero = require('../components/hero')
var grid = require('../components/grid')
var card = require('../components/card')
var event = require('../components/event')
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

            <div class="View-section">
              <div class="u-container">
                ${grid({
                  size: {
                    md: '1of2',
                    lg: '1of3'
                  }
                }, featuredPosts)}
              </div>
            </div>

            <div class="View-section">
              <div class="u-container">
                ${grid({
                  size: {
                    md: '1of2'
                  }
                }, featuredEvents)}
              </div>
            </div>

            <div class="View-section View-section--grayToWhite">
              <p class="u-textCenter">karta</p>
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
    date: {
      text: '25 April',
      datetime: ''
    },
    title: 'Salim Ismail Exponential Impact',
    body: '',
    location: 'São Paulo, Brazil',
    link: {
      href: '#/'
    },
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

var eventData = [
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
  }
]
