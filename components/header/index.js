var html = require('choo/html')
var Component = require('choo/component')
var symbol = require('../base/symbol')
var { i18n } = require('../base')

var text = i18n()

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.emit = emit
    this.local = state.components[id] = {
      id: id,
      state: state
    }
  }

  update (links, href, opts) {
    return href !== this.local.href
  }

  createElement (href, categories = []) {
    this.local.href = href.replace(/\/$/, '')
    var { id, state } = this.local
    var emit = this.emit
    var open = state.ui.openNavigation

    return html`
      <header class="Header ${open ? 'is-open' : ''}" id="${id}">
        <div class="Header-content u-container">
          <a class="Header-home" href="/">
            ${symbol.logo('Header-logo')}${symbol.global('Header-logotype')}
          </a>
          <div class="Header-menu">
            <a class="Header-toggle" onclick=${toggle} href="#navigation">
              <span class="u-hiddenVisually">${text`Toggle navigation`}</span>
              <div class="Header-figure"><div class="Header-lines"></div></div>
            </a>
          </div>
        </div>
      </header>
    `

    function toggle (event) {
      emit('header:toggle', !open)
      event.preventDefault()
    }
  }
}
