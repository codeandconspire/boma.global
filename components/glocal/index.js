var html = require('choo/html')

module.exports = glocal

function glocal (children) {
  return html`
    <div class="Glocal">
      <div class="Glocal-figure">
        global +<br>
        local =<br>
        <span class="Glocal-tinted">
          glocal
          <svg class="Glocal-symbol" width="36" height="42" viewBox="0 0 36 42">
            <path fill="currentColor" fill-rule="evenodd" d="M18 35.2c10 0 18-7.9 18-17.6C36 7.9 28 0 18 0S0 7.9 0 17.6v23c0 1.8 1.7 1.8 2.4.4 1.3-2.7 2.2-5.8 6-5.8H18z"/>
          </svg>
        </span>
      </div>
      <div class="Glocal-body">${children}</div>
    </div>
  `
}
