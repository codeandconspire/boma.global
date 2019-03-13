var html = require('choo/html')
var Component = require('choo/component')
var button = require('../button')
var { className, loader } = require('../base')

module.exports = class Hero extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  load (el) {
    if (!this.local.words) {
      return
    }

    var words = Array.from(el.querySelectorAll('.js-rotate'))
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
        ${image ? html`<img class="Hero-image" ${imageAttrs} src="${image.src}" />` : null}
      </div>
    `
  }
}
