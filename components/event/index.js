var html = require('choo/html')
var link = require('./link')
var figure = require('./figure')
var { className, snippet, loader } = require('../base')

module.exports = event
event.loading = loading

function event (props = {}, slot) {
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
    class: className('Event', {
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
            <time class="Event-meta u-textBold" datetime="${JSON.stringify(props.date.datetime).replace(/"/g, '')}">
              ${props.date.text}
            </time>
          ` : null}
          <h3 class="Event-title u-textBold">
            ${props.title}
          </h3>
          ${body}
          ${props.location ? html`
            <div class="Event-footer">
              <svg class="Event-footerIcon" width="11" height="13" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor" fill-rule="nonzero"><path d="M5.5.25a5 5 0 0 0-5 4.95c0 3.42 4.4 7.24 4.6 7.4.23.2.57.2.8 0 .22-.16 4.6-3.97 4.6-7.4a5 5 0 0 0-5-4.95zm0 11.03c-1.04-1-3.75-3.75-3.75-6.08a3.75 3.75 0 0 1 7.5 0c0 2.31-2.7 5.09-3.75 6.08z"/><path d="M5.5 2.75a2.19 2.19 0 1 0 0 4.38 2.19 2.19 0 0 0 0-4.38zm0 3.13A.94.94 0 1 1 5.5 4a.94.94 0 0 1 0 1.88z"/></g>
              </svg>
              ${props.location}
            </div>
          ` : null}
        </div>
        ${props.link ? link(Object.assign({ inherit: props.background }, props.link)) : null}
      </div>
    </article>
  `
}

function loading (props = {}) {
  return html`
    <article class="Event">
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
