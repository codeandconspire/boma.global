var html = require('choo/html')
var Component = require('choo/component')
var symbol = require('../base/symbol')

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
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
    var { id } = this.local

    return html`
      <header class="Header" id="${id}">
        <div class="u-container">
          <a class="Header-home" href="/">
            ${symbol.logo('Header-logo')}${symbol.global('Header-logotype')}
          </a>
        </div>
      </header>
    `
  }
}
