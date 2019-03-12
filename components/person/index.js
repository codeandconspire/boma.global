var html = require('choo/html')
var figure = require('./figure')
var { className, snippet, loader } = require('../base')

module.exports = person
person.loading = loading

function person (props = {}) {
  var body = props.body
  if (body) {
    if (typeof window === 'undefined') {
      if (Array.isArray(body) || body[0] === '<') body = html`<div class="Person-text">${body}</div>`
      else body = html`<p class="Person-text">${snippet(body, props.truncate || 170)}</p>`
    } else if (Array.isArray(body) || body instanceof window.Element) {
      body = html`<div class="Person-text">${body}</div>`
    } else {
      body = html`<p class="Person-text">${snippet(body, props.truncate || 170)}</p>`
    }
  }

  var attrs = {
    class: className('Person', {
      'Person--?': false
    })
  }

  var image = props.image || props.background || null
  if (typeof image === 'function') image = image()
  else if (image) image = figure(image)

  return html`
    <div ${attrs}>
      ${image}
      <div class="Person-info">
        <h3 class="Person-title">
          ${props.title}
        </h3>
        ${body}
        ${props.community ? html`<p class="Person-community">${props.community}</p>` : null}
      </div>
    </div>
  `
}

function loading (props = {}) {
  return html`
    <div class=Person is-loading">
      ${figure.loading()}
      <div class="Person-info">
        <h3 class="Person-title">${loader(4)}</h3>
      </div>
    </div>
  `
}
