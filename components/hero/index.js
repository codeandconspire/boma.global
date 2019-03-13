var html = require('choo/html')
var Component = require('choo/component')
var nanoraf = require('nanoraf')
var button = require('../button')
var { className, loader, vh } = require('../base')

module.exports = class Hero extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  static loading (opts = {}) {
    return html`
      <div class="${className('Hero is-loading', { 'Hero--center': opts.center, 'Hero--image': opts.image })}">
        <div class="Hero-content">
          <div class="Hero-container u-container">
            <h2 class="Hero-title">${loader(opts.center ? 8 : 28)}</h2>
          </div>
        </div>
        <div class="Hero-image"></div>
      </div>
    `
  }

  moveContent (el, parent) {
    var speed = 0.2
    var height, offset

    var onScroll = nanoraf(function () {
      var { scrollY } = window
      if (scrollY > offset + height) return // after element
      el.style.setProperty('--Hero-scroll', `${Math.round(scrollY * speed)}px`)
    })

    var onResize = nanoraf(function () {
      height = el.offsetHeight
      onScroll()
    })

    onResize()
    onScroll()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  rotateWords (words) {
    var count = words.length
    var currentText = 0
    var rotatingDelay = this.local.rotatingDelay

    function animateTextOut (el) {
      el.classList.remove('in')
      el.classList.add('out')

      setTimeout(function () {
        el.classList.remove('out')
      }, rotatingDelay + 100)
    }

    function animateTextIn (el) {
      el.classList.remove('out')
      el.classList.add('in')
    }

    function changeText () {
      var currentTextEl = words[currentText]
      var nextTextEl = currentText === words.length - 1 ? words[0] : words[currentText + 1]

      animateTextOut(currentTextEl)
      animateTextIn(nextTextEl)

      currentText = (currentText === count - 1) ? 0 : currentText + 1
    }

    changeText()

    var changeTextInterval = setInterval(changeText, 2000)

    this.unload = function () {
      clearInterval(changeTextInterval)
    }
  }

  load (el) {
    var moveEl = el.querySelector('.js-move')
    var rotatingWords = Array.from(el.querySelectorAll('.js-rotate'))

    if (moveEl) {
      this.moveContent(moveEl, el)
    }

    if (this.local.words && rotatingWords.length) {
      this.rotateWords(rotatingWords)
    }
  }

  update () {
    return false
  }

  createElement (props) {
    var { action, image, title, body, words } = props

    Object.assign(this.local, props)

    var rotatingWords = false
    var rotatingDelay = this.local.rotatingDelay = 600

    if (title && words) {
      var parts = title.split('#WORDS')
      rotatingWords = (words && parts.length > 1)
    }

    var attrs = {
      id: this.local.id,
      class: className('Hero', {
        'Hero--center': !rotatingWords,
        'Hero--image': image
      })
    }

    var titleElement = rotatingWords ? html`
      ${parts[0]} <span class="Hero-rotateWrap">
      ${words.map(function (title) {
        return html`<span class="Hero-rotateText js-rotate" style="--Hero-rotatingDelay: ${rotatingDelay}ms">${title}</span>`
      })}
      </span> <span class="u-block">${parts[1]}</span>
    ` : title

    return html`
      <div ${attrs}>
        <div class="Hero-content">
          <div class="Hero-container u-container">
            <h2 class="Hero-title">${titleElement}</h2>
            ${body ? html`<div class="Hero-text">${body}</div>` : null}
            ${action ? html`
              <div class="Hero-action">
                ${button({ href: action.href, text: action.text })}
              </div>
            ` : null}
          </div>
        </div>
        ${image ? getImage(image) : null}
      </div>
    `
  }
}

// get hero image element
// obj -> Element
function getImage (props) {
  var attrs = {}
  Object.keys(props).forEach(function (key) {
    if (key !== 'src') attrs[key] = props[key]
  })
  return html`<div class="Hero-wrap"><img class="Hero-image js-move" ${attrs} src="${props.src}" /></div>`
}
