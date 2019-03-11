var html = require('choo/html')
var Component = require('choo/component')
var { i18n } = require('../base')
var text = i18n(require('./lang.json'))

module.exports = class hero extends Component {
  constructor (id, state, emit) {
    super(id)

    var textArray = [
      text`TEXT_1`,
      text`TEXT_2`,
      text`TEXT_3`,
      text`TEXT_4`
    ]
    var lastItem = textArray.pop()
    textArray.unshift(lastItem)

    this.local = state.components[id] = {
      id: id,
      state: state,
      textArray: textArray
    }
  }

  load (el) {
    var that = this
    var textElements = Array.from(el.querySelectorAll('.js-rotate'))
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
      var currentTextEl = textElements[currentText]
      var nextTextEl = currentText === textElements.length - 1 ? textElements[0] : textElements[currentText + 1]

      animateTextOut(currentTextEl)
      animateTextIn(nextTextEl)

      currentText = (currentText === that.local.textArray.length - 1) ? 0 : currentText + 1
    }

    changeText()

    var changeTextInterval = setInterval(changeText, 2000)

    this.unload = function () {
      clearInterval(changeTextInterval)
    }
  }

  update () {
    return true
  }

  createElement () {
    return html`
      <div class="Hero">
        <div class="Hero-content">
          <div class="u-container">
            <h2 class="Hero-title u-textBold">
              Supporting <span class="Hero-rotateWrap">
              ${this.local.textArray.map(function (text) {
                return html`<span class="Hero-rotateText js-rotate">${text}</span>`
              })}
              </span> <span class="u-block">to navigate our rapidly changing world</span>
            </h2>
          </div>
        </div>
        <img class="Hero-image" src="https://via.placeholder.com/2600x1000/0000FF/808080" alt="">
      </div>
    `
  }
}
