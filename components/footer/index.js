var html = require('choo/html')
var Component = require('choo/component')
var { i18n } = require('../base')
var symbol = require('../base/symbol')

var text = i18n()

module.exports = class Footer extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.local = state.components[id] = {
      id: id,
      alternative: state.ui.openNavigation
    }
  }

  update (props) {
    if (props && !this.local.props) return true
    return this.state.ui.openNavigation !== this.local.alternative
  }

  createElement (props) {
    if (!props) return html`<footer class="Footer"></footer>`
    this.local.props = props
    var alt = this.local.alternative = this.state.ui.openNavigation

    return html`
      <footer class="Footer ${alt ? 'Footer--alt' : ''}" id="navigation">
        <div class="u-container">
          ${props.social.length ? html`
            <div class="Footer-social">
              <div class="Footer-section Footer-section--inline Footer-section--social">
                <h2 class="Footer-title">${text`Follow us`}</h2>
                <ul class="Footer-list">
                  ${props.social.map((item) => html`
                    <li class="Footer-item">
                      <a class="Footer-icon" href="${item.href}" target="_blank" rel="noopener noreferrer">
                        <span class="u-hiddenVisually">${item.type}</span>
                        ${logo(item.type)}
                      </a>
                    </li>
                  `)}
                </ul>
              </div>
            </div>
          ` : null}

          <nav>
            <ul class="Footer-menu">
              ${props.menu.map(({ label, href, children, onclick }, index) => html`
                <li class="Footer-section ${alt ? 'u-slideDown' : ''}" style="animation-delay: ${alt ? index * 150 : 0}ms">
                  <div class="Footer-item">
                    <a class="Footer-link Footer-link--primary" href="${href}" onclick=${onclick}>${symbol.arrow(label)}</a>
                  </div>
                  <ul class="Footer-list">
                    ${children.map(({ label, href, onclick }) => html`
                      <li class="Footer-item">
                        <a class="Footer-link" href="${href}" onclick=${onclick}>${label}</a>
                      </li>
                    `)}
                  </ul>
                </li>
              `)}
            </ul>
          </nav>

          <div class="Footer-meta ${alt ? 'u-slideDown' : ''}">
            ${props.legal.length ? html`
              <div class="Footer-section Footer-section--inline">
                <ul class="Footer-list">
                  ${props.legal.map(({ label, href, onclick }) => html`
                    <li class="Footer-item">
                      <a class="Footer-link" href="${href}" onclick=${onclick}>${label}</a>
                    </li>
                  `)}
                </ul>
              </div>
            ` : null}
            <a class="Footer-home" href="/" onclick=${scrollTop}>
              ${symbol.logo('Footer-logo')}
            </a>
            <span class="Footer-copy">${text`Copyright`} ${(new Date()).getFullYear()}</span>
          </div>
        </div>
      </footer>
    `
  }
}

function scrollTop () {
  window.scrollTo(0, 0)
}

function logo (type) {
  switch (type) {
    case 'Facebook': return html`<svg class="Footer-network" viewBox="0 0 11 22"><path fill="currentColor" fill-rule="nonzero" d="M7.13 21.2v-9.66h3.25l.5-3.78H7.12v-2.4c0-1.1.3-1.84 1.87-1.84h2V.15C10.03.05 9.06 0 8.1 0 5.2 0 3.24 1.76 3.24 4.98v2.78H0v3.78h3.25v9.66h3.88z"/></svg>`
    case 'Twitter': return html`<svg class="Footer-network Footer-network--pushed" viewBox="0 0 23 19"><path fill="currentColor" fill-rule="nonzero" d="M7.2 18.3c8.4 0 13-7 13-13v-.7c1-.6 1.7-1.4 2.3-2.4-.8.4-1.7.7-2.6.8 1-.6 1.6-1.5 2-2.6-1 .6-1.9 1-3 1.1a4.6 4.6 0 0 0-7.7 4.2A13 13 0 0 1 1.7 1a4.6 4.6 0 0 0 1.4 6.2c-.7 0-1.4-.2-2-.6 0 2.2 1.5 4.1 3.6 4.6-.7.1-1.4.2-2 0a4.6 4.6 0 0 0 4.2 3.2 9.2 9.2 0 0 1-6.8 2 13 13 0 0 0 7 2"/></svg>`
    case 'Instagram': return html`<svg class="Footer-network Footer-network--smaller" viewBox="0 0 22 22"><g fill="currentColor" fill-rule="evenodd"><path d="M11 0a78 78 0 0 0-4.54.07A8.07 8.07 0 0 0 3.8.58c-.72.29-1.33.66-1.94 1.27A5.39 5.39 0 0 0 .58 3.8C.3 4.5.12 5.3.07 6.47A78 78 0 0 0 0 11a78 78 0 0 0 .07 4.54c.05 1.17.24 1.97.5 2.67.29.72.66 1.33 1.28 1.94a5.4 5.4 0 0 0 1.94 1.27c.7.27 1.5.46 2.67.51A78 78 0 0 0 11 22a78 78 0 0 0 4.53-.07 8.07 8.07 0 0 0 2.67-.5 5.4 5.4 0 0 0 1.95-1.28 5.4 5.4 0 0 0 1.27-1.94c.27-.7.45-1.5.5-2.67A78 78 0 0 0 22 11a78 78 0 0 0-.06-4.53 8.07 8.07 0 0 0-.51-2.67 5.4 5.4 0 0 0-1.27-1.95A5.39 5.39 0 0 0 18.2.58c-.7-.27-1.5-.45-2.67-.5A78 78 0 0 0 11 0zm4.44 2.05c1.07.05 1.65.23 2.04.38.52.2.88.44 1.27.82.38.39.62.75.82 1.27.15.39.33.97.38 2.04C20 7.72 20 8.06 20 11c0 2.94-.01 3.29-.06 4.45a6.08 6.08 0 0 1-.38 2.04c-.2.51-.44.88-.82 1.26a3.4 3.4 0 0 1-1.27.83c-.39.15-.97.33-2.04.37-1.16.06-1.5.07-4.44.07a76.3 76.3 0 0 1-4.45-.07 6.08 6.08 0 0 1-2.04-.37 3.4 3.4 0 0 1-1.26-.83 3.4 3.4 0 0 1-.83-1.26 6.08 6.08 0 0 1-.37-2.04c-.06-1.16-.07-1.51-.07-4.45 0-2.93.01-3.28.07-4.44.04-1.07.22-1.65.37-2.04.2-.52.44-.88.83-1.27a3.4 3.4 0 0 1 1.26-.82c.39-.15.97-.33 2.04-.38C7.71 2 8.06 2 11 2c2.93 0 3.28.01 4.44.06z"/><path d="M11 14.69a3.69 3.69 0 1 1 0-7.38 3.69 3.69 0 0 1 0 7.38zm0-9.37a5.68 5.68 0 1 0 0 11.36 5.68 5.68 0 0 0 0-11.36zM18.12 5.18a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0"/></g></svg>`
    case 'YouTube': return html`<svg class="Footer-network" viewBox="0 0 25 18"><path fill="currentColor" fill-rule="evenodd" d="M24.3 2.9c.5 2 .5 6 .5 6s0 4-.5 6c-.3 1-1.2 1.8-2.2 2.1-2 .5-9.7.5-9.7.5s-7.8 0-9.7-.5c-1-.3-1.9-1.1-2.2-2.2-.5-1.9-.5-6-.5-6S0 4.9.5 3C.8 1.9 1.6 1 2.7.7c2-.5 9.7-.5 9.7-.5s7.7 0 9.7.5C23 1 24 1.8 24.3 3zM9.9 12.6l6.5-3.7-6.5-3.7v7.4z"/></svg>`
    case 'LinkedIn': return html`<svg class="Footer-network Footer-network--smaller" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M16.62 16.58h-2.89v-4.51c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.18-1.73 2.39v4.6H7.62v-9.3h2.77v1.27h.04a3.03 3.03 0 0 1 2.73-1.5c2.92 0 3.46 1.93 3.46 4.43v5.1zM4.36 6.03a1.67 1.67 0 1 1 0-3.35 1.67 1.67 0 0 1 0 3.35zM2.92 16.58h2.89V7.3H2.92v9.28zM18.06 0H1.47C.68 0 .04.63.04 1.4v16.66c0 .77.64 1.4 1.43 1.4h16.59c.79 0 1.44-.63 1.44-1.4V1.4c0-.77-.65-1.4-1.44-1.4z"/></svg>`
    default: return null
  }
}
