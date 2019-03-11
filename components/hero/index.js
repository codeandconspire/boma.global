var html = require('choo/html')
var Component = require('choo/component')
var { loader } = require('../base')

module.exports = class Hero extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  load (el) {
    var that = this
    var words = Array.from(el.querySelectorAll('.js-rotate'))
    var count = words.length
    var currentText = 0

    function animateTextOut (el) {
      el.classList.remove('in')
      el.classList.add('out')
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

  update (text, words) {
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

  createElement (text, words, image) {
    this.local.text = text
    this.local.words = words

    var attrs = {}
    if (image) {
      Object.keys(image).forEach(function (key) {
        if (key !== 'src') attrs[key] = image[key]
      })
    }

    var parts = text.split('#WORDS')

    return html`
      <div class="Hero" id="${this.local.id}">
        <div class="Hero-content">
          <div class="u-container">
            <h2 class="Hero-title">
              ${parts[0]} <span class="Hero-rotateWrap">
              ${words.map(function (text) {
                return html`<span class="Hero-rotateText js-rotate">${text}</span>`
              })}
              </span> <span class="u-block">${parts[1]}</span>
            </h2>
          </div>
        </div>
        ${image ? html`<img class="Hero-image" ${attrs} src="${image.src}" />` : null}
      </div>
    `
  }
}
