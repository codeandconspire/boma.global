var html = require('choo/html')
var Component = require('choo/component')

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

  load (element) {
    // Quick fix for enabling active states in iOS (forgot how it works…)
    element.addEventListener('touchstart', function () {}, false)
  }

  createElement (href, categories = []) {
    this.local.href = href.replace(/\/$/, '')
    var { id } = this.local

    return html`
      <header class="Header" id="${id}">
        <div class="u-container">
          header
        </div>
      </header>
    `
  }
}
