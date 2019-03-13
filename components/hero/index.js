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

  load (el) {
    var moveEl = el.querySelector('.js-move')
    var rotatingWords = Array.from(el.querySelectorAll('.js-rotate'))

    if (moveEl) {
      this.moveContent(moveEl)
    }

    if (this.local.words && rotatingWords.length) {
      this.rotateWords(rotatingWords)
    }
  }

  update (props) {
    var { text, words } = props

    if (text !== this.local.text) return true
    if (words.join() !== this.local.words.join()) return true
    return false
  }

  static loading () {
    return html`
      <div class="Hero is-loading">
        <div class="Hero-content">
          <div class="u-container">
            <h2 class="Hero-title">
              ${loader(28)}
            </h2>
          </div>
        </div>
      </div>
    `
  }

  moveContent (el) {
    var speed = 0.06
    var height, offset
    var inview

    var onScroll = nanoraf(function () {
      var { scrollY } = window

      if (
        (scrollY > offset + height) || // Below element
        (scrollY + vh() < offset) // Above element
      ) {
        return
      }

      if (inview) {
        el.style.setProperty('--Hero-scroll', `${Math.round(scrollY * speed)}px`)
      }

      inview = true
    })

    var onResize = nanoraf(function () {
      height = el.offsetHeight
      offset = el.offsetTop
      var parent = el
      while ((parent = parent.offsetParent)) offset += parent.offsetTop
      onScroll()
    })

    onScroll()
    onResize()
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

  createElement (props) {
    var { action, image, title, body, words } = props
    var rotatingWords = false

    var rotatingDelay = this.local.rotatingDelay = 600

    if (title && words) {
      this.local.title = title
      this.local.words = words

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

    var imageAttrs = {}

    if (image) {
      Object.keys(image).forEach(function (key) {
        if (key !== 'src') imageAttrs[key] = image[key]
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
        <div class="Hero-content js-move">
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
        ${image ? html`<img class="Hero-image" ${imageAttrs} src="${image.src}" />` : null}
      </div>
    `
  }
}
