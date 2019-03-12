var html = require('choo/html')
var { loader } = require('../base')

module.exports = principles
principles.loading = loading

function pad (num, size) {
  var s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

function principles (content = []) {
  return html`
    <div class="Principles">
      <div class="u-container">
      ${content.map(function (item, index) {
        var body = item.body

        if (body) {
          if (typeof window === 'undefined') {
            if (Array.isArray(body) || body[0] === '<') html`<div>${body}</div>`
            else body = html`<p>${body}</p>`
          } else if (Array.isArray(body) || body instanceof window.Element) {
            body = html`<div>${body}</div>`
          } else {
            body = html`<p>${body}</p>`
          }
        }

        return html`
          <div class="Principles-item">
            <p class="Principles-number">${pad(index + 1, 2)}.</p>
            ${item.title ? html`<h2 class="Principles-title">${item.title}</h2>` : null}
            ${item.body ? html`<p class="Principles-body">${body}</p>` : null}
          </div>
        `
      })}
      </div>
    </div>
  `
}

function loading () {
  return html`
    <div class="Principles">
      <div class="u-container">
        <div class="Principles-item">
          <p class="Principles-number">01.</p>
          <h2 class="Principles-title">${loader(3)}</h2>
          <p class="Principles-body">${loader(20)}</p>
        </div>
        <div class="Principles-item">
          <p class="Principles-number">02.</p>
          <h2 class="Principles-title">${loader(3)}</h2>
          <p class="Principles-body">${loader(20)}</p>
        </div>
      </div>
    </div>
  `
}
