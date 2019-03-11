var html = require('choo/html')
var Component = require('choo/component')
var { i18n } = require('../base')
var text = i18n()

module.exports = class Footer extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.local = state.components[id] = { id: id }
  }

  update (doc) {
    return !this.local.doc && doc
  }

  createElement (doc) {
    this.local.doc = doc
    if (!doc) return html`<footer class="Footer"></footer>`

    return html`
      <footer class="Footer">
        <div class="u-container">
          <div class="Footer-social">
            <div class="Footer-section Footer-section--inline Footer-section--social">
              <h2 class="Footer-title">${text`Follow us`}</h2>
              <ul class="Footer-list">
                <li class="Footer-item">
                  <a class="Footer-icon" href="#">
                    <span class="u-hiddenVisually">Facebook</span>
                    <svg class="Footer-network Footer-network--pushed" viewBox="0 0 11 22"><path fill="currentColor" fill-rule="nonzero" d="M7.13 21.2v-9.66h3.25l.5-3.78H7.12v-2.4c0-1.1.3-1.84 1.87-1.84h2V.15C10.03.05 9.06 0 8.1 0 5.2 0 3.24 1.76 3.24 4.98v2.78H0v3.78h3.25v9.66h3.88z"/></svg>
                  </a>
                </li>
                <li class="Footer-item">
                  <a class="Footer-icon" href="#">
                    <svg class="Footer-network Footer-network--pushed" viewBox="0 0 23 19"><path fill="currentColor" fill-rule="nonzero" d="M7.2 18.3c8.4 0 13-7 13-13v-.7c1-.6 1.7-1.4 2.3-2.4-.8.4-1.7.7-2.6.8 1-.6 1.6-1.5 2-2.6-1 .6-1.9 1-3 1.1a4.6 4.6 0 0 0-7.7 4.2A13 13 0 0 1 1.7 1a4.6 4.6 0 0 0 1.4 6.2c-.7 0-1.4-.2-2-.6 0 2.2 1.5 4.1 3.6 4.6-.7.1-1.4.2-2 0a4.6 4.6 0 0 0 4.2 3.2 9.2 9.2 0 0 1-6.8 2 13 13 0 0 0 7 2"/></svg>
                    <span class="u-hiddenVisually">Twitter</span>
                  </a>
                </li>
                <li class="Footer-item">
                  <a class="Footer-icon" href="#">
                    <svg class="Footer-network Footer-network--smaller" viewBox="0 0 22 22"><g fill="currentColor" fill-rule="evenodd"><path d="M11 0a78 78 0 0 0-4.54.07A8.07 8.07 0 0 0 3.8.58c-.72.29-1.33.66-1.94 1.27A5.39 5.39 0 0 0 .58 3.8C.3 4.5.12 5.3.07 6.47A78 78 0 0 0 0 11a78 78 0 0 0 .07 4.54c.05 1.17.24 1.97.5 2.67.29.72.66 1.33 1.28 1.94a5.4 5.4 0 0 0 1.94 1.27c.7.27 1.5.46 2.67.51A78 78 0 0 0 11 22a78 78 0 0 0 4.53-.07 8.07 8.07 0 0 0 2.67-.5 5.4 5.4 0 0 0 1.95-1.28 5.4 5.4 0 0 0 1.27-1.94c.27-.7.45-1.5.5-2.67A78 78 0 0 0 22 11a78 78 0 0 0-.06-4.53 8.07 8.07 0 0 0-.51-2.67 5.4 5.4 0 0 0-1.27-1.95A5.39 5.39 0 0 0 18.2.58c-.7-.27-1.5-.45-2.67-.5A78 78 0 0 0 11 0zm4.44 2.05c1.07.05 1.65.23 2.04.38.52.2.88.44 1.27.82.38.39.62.75.82 1.27.15.39.33.97.38 2.04C20 7.72 20 8.06 20 11c0 2.94-.01 3.29-.06 4.45a6.08 6.08 0 0 1-.38 2.04c-.2.51-.44.88-.82 1.26a3.4 3.4 0 0 1-1.27.83c-.39.15-.97.33-2.04.37-1.16.06-1.5.07-4.44.07a76.3 76.3 0 0 1-4.45-.07 6.08 6.08 0 0 1-2.04-.37 3.4 3.4 0 0 1-1.26-.83 3.4 3.4 0 0 1-.83-1.26 6.08 6.08 0 0 1-.37-2.04c-.06-1.16-.07-1.51-.07-4.45 0-2.93.01-3.28.07-4.44.04-1.07.22-1.65.37-2.04.2-.52.44-.88.83-1.27a3.4 3.4 0 0 1 1.26-.82c.39-.15.97-.33 2.04-.38C7.71 2 8.06 2 11 2c2.93 0 3.28.01 4.44.06z"/><path d="M11 14.69a3.69 3.69 0 1 1 0-7.38 3.69 3.69 0 0 1 0 7.38zm0-9.37a5.68 5.68 0 1 0 0 11.36 5.68 5.68 0 0 0 0-11.36zM18.12 5.18a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0"/></g></svg>
                    <span class="u-hiddenVisually">Instagram</span>
                  </a>
                </li>
                <li class="Footer-item">
                  <a class="Footer-icon" href="#">
                    <svg class="Footer-network" viewBox="0 0 25 18"><path fill="currentColor" fill-rule="evenodd" d="M24.3 2.9c.5 2 .5 6 .5 6s0 4-.5 6c-.3 1-1.2 1.8-2.2 2.1-2 .5-9.7.5-9.7.5s-7.8 0-9.7-.5c-1-.3-1.9-1.1-2.2-2.2-.5-1.9-.5-6-.5-6S0 4.9.5 3C.8 1.9 1.6 1 2.7.7c2-.5 9.7-.5 9.7-.5s7.7 0 9.7.5C23 1 24 1.8 24.3 3zM9.9 12.6l6.5-3.7-6.5-3.7v7.4z"/></svg>
                    <span class="u-hiddenVisually">Youtube</span>
                  </a>
                </li>
                <li class="Footer-item">
                  <a class="Footer-icon" href="#">
                    <svg class="Footer-network Footer-network--smaller" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M16.62 16.58h-2.89v-4.51c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.18-1.73 2.39v4.6H7.62v-9.3h2.77v1.27h.04a3.03 3.03 0 0 1 2.73-1.5c2.92 0 3.46 1.93 3.46 4.43v5.1zM4.36 6.03a1.67 1.67 0 1 1 0-3.35 1.67 1.67 0 0 1 0 3.35zM2.92 16.58h2.89V7.3H2.92v9.28zM18.06 0H1.47C.68 0 .04.63.04 1.4v16.66c0 .77.64 1.4 1.43 1.4h16.59c.79 0 1.44-.63 1.44-1.4V1.4c0-.77-.65-1.4-1.44-1.4z"/></svg>
                    <span class="u-hiddenVisually">LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <nav>
            <ul class="Footer-menu">
              <li class="Footer-section">
                <li class="Footer-item"><a class="Footer-link Footer-link--primary" href="#">About Boma</a></li>
                <li>
                  <ul class="Footer-list">
                    <li class="Footer-item"><a class="Footer-link" href="#">First link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Next link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Other link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Important link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">last one</a></li>
                  </ul>
                </li>
              </li>
              <li class="Footer-section">
                <li class="Footer-item"><a class="Footer-link Footer-link--primary" href="#">About Boma</a></li>
                <li>
                  <ul class="Footer-list">
                    <li class="Footer-item"><a class="Footer-link" href="#">First link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Important link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">last one</a></li>
                  </ul>
                </li>
              </li>
              <li class="Footer-section">
                <li class="Footer-item"><a class="Footer-link Footer-link--primary" href="#">About Boma</a></li>
                <li>
                  <ul class="Footer-list">
                    <li class="Footer-item"><a class="Footer-link" href="#">First link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Important link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">last one</a></li>
                  </ul>
                </li>
              </li>
              <li class="Footer-section">
                <li class="Footer-item"><a class="Footer-link Footer-link--primary" href="#">About Boma</a></li>
                <li>
                  <ul class="Footer-list">
                    <li class="Footer-item"><a class="Footer-link" href="#">First link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Next link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Other link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Important link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">last one</a></li>
                  </ul>
                </li>
              </li>
              <li class="Footer-section">
                <li class="Footer-item"><a class="Footer-link Footer-link--primary" href="#">About Boma</a></li>
                <li>
                  <ul class="Footer-list">
                    <li class="Footer-item"><a class="Footer-link" href="#">First link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Next link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Other link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Important link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">last one</a></li>
                  </ul>
                </li>
              </li>
              <li class="Footer-section">
                <li class="Footer-item"><a class="Footer-link Footer-link--primary" href="#">About Boma</a></li>
                <li>
                  <ul class="Footer-list">
                    <li class="Footer-item"><a class="Footer-link" href="#">First link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Next link</a></li>
                    <li class="Footer-item"><a class="Footer-link" href="#">Other link</a></li>
                  </ul>
                </li>
              </li>
            </ul>
          </nav>

          <div class="Footer-meta">
            <div class="Footer-section Footer-section--inline">
              <ul class="Footer-list">
                <li class="Footer-item"><a class="Footer-link" href="#">Terms & conditions</a></li>
                <li class="Footer-item"><a class="Footer-link" href="#">Privacy policy</a></li>
                <li class="Footer-item"><a class="Footer-link" href="#">Cookies</a></li>
                <li class="Footer-item"><a class="Footer-link" href="#">GDPR</a></li>
                <li class="Footer-item"><a class="Footer-link" href="#">Anti-corruption policy</a></li>
              </ul>
            </div>
            <a class="Footer-home" href="/" onclick=${scrollTop} title="${text`Go to start page`}">
              <svg class="Footer-logo" viewBox="0 0 89 27"><path fill="currentColor" fill-rule="evenodd" d="M82.76 22.18h-7.91a5.77 5.77 0 0 1-5.73-5.8c0-3.19 2.57-5.79 5.74-5.79h.13a5.82 5.82 0 0 1 5.52 5.92v2.68c0 .93.54 1.77 1.38 2.16l.96.45c.19.1.12.38-.09.38zm-50.08 0a5.77 5.77 0 0 1-5.74-5.8c0-3.19 2.57-5.79 5.74-5.79 3.16 0 5.73 2.6 5.73 5.8 0 3.2-2.57 5.79-5.73 5.79zm-18.54 0h-.21a5.88 5.88 0 0 1-5.52-5.92v-2.71c0-.92-.52-1.75-1.34-2.14l-.92-.44c-.19-.1-.12-.38.09-.38H14a5.85 5.85 0 0 1 5.87 5.63 5.77 5.77 0 0 1-5.74 5.96zM89 24.36c0-1.2-.97-2.18-2.16-2.18h-1.45V5.77h-2.71c-.74 0-1.43.38-1.83 1.03l-.36.6-.61-.34a10.3 10.3 0 0 0-5-1.29h.02-.13c-2.9 0-5.54 1.2-7.44 3.14a7.97 7.97 0 0 0-6.28-3.14 8 8 0 0 0-5.2 1.92l-.47.4-.47-.4a8 8 0 0 0-5.43-1.92 8.15 8.15 0 0 0-7.43 5.8 10.5 10.5 0 0 0-9.37-5.8 10.5 10.5 0 0 0-9.28 5.65 10.76 10.76 0 0 0-9.44-5.65H8.42l-.01-3.6C8.4.98 7.44 0 6.25 0H3.62l.02 5.77H0l.01 2.64c0 1.2.97 2.18 2.16 2.18h1.45l.02 5.8c0 6.12 5.16 11.05 11.33 10.58a10.54 10.54 0 0 0 8.44-5.58A10.5 10.5 0 0 0 32.67 27c3.8 0 7.14-2.05 8.99-5.1V27h4.78v-2.78l-.01-10.23a3.36 3.36 0 0 1 3.28-3.4 3.3 3.3 0 0 1 3.28 3.31V27h4.78v-3.34l-.01-9.67a3.36 3.36 0 0 1 3.28-3.4 3.3 3.3 0 0 1 3.28 3.31v1.46A10.57 10.57 0 0 0 74.78 27H89l-.01-2.64z"/></svg>
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
