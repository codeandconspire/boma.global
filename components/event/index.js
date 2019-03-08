var html = require('choo/html')
var link = require('./link')
var figure = require('./figure')
var { className, snippet, loader } = require('../base')

module.exports = card
card.loading = loading

function card (props = {}, slot) {
  var body = props.body
  if (body) {
    if (typeof window === 'undefined') {
      if (Array.isArray(body) || body[0] === '<') html`<div class="Event-text">${body}</div>`
      else body = html`<p class="Event-text">${snippet(body, props.truncate || 170)}</p>`
    } else if (Array.isArray(body) || body instanceof window.Element) {
      body = html`<div class="Event-text">${body}</div>`
    } else {
      body = html`<p class="Event-text">${snippet(body, props.truncate || 170)}</p>`
    }
  }

  if (props.link) {
    props.link.block = true
  }

  var attrs = {
    class: className('Card', {
      'Event--interactive': props.link,
      'Event--image': props.image,
      'Event--video': props.video
    })
  }

  var cover = null
  if (props.image) {
    cover = figure(props.image)
  }

  return html`
    <article ${attrs}>
      ${cover}
      <div class="Event-content">
        <div class="Event-body">
          ${props.date && props.date.text ? html`
            <time class="Event-meta" datetime="${JSON.stringify(props.date.datetime).replace(/"/g, '')}">
              ${props.date.text}
            </time>
          ` : null}
          <h3 class="Event-title u-textBold">
            ${props.type ? html`
              <span><span class="Event-type">${props.type}:</span> ${props.title}</span>
            ` : props.title}
          </h3>
          ${body}
          ${props.link && props.link.title && (
            html`<div class="Event-action u-textBold">${props.link.title}</div>`
          )}
        </div>
        ${props.link ? link(Object.assign({ inherit: props.background }, props.link)) : null}
      </div>
    </article>
  `
}

function loading (props = {}) {
  return html`
    <article class="Card">
      ${figure.loading()}
      <div class="Event-content">
        <div class="Event-body">
          ${props.date ? html`<time class="Event-meta">${loader(8)}</time>` : null}
          <h3 class="Event-title">${loader(8)}</h3>
          <p class="Event-text">${loader(24)}</p>
        </div>
      </div>
    </article>
  `
}
